import { AtomDisposableList } from "../../core/AtomDisposableList";
import Bind from "../../core/Bind";
import { BindableProperty } from "../../core/BindableProperty";
import Colors from "../../core/Colors";
import { CancelToken, IClassOf, IDisposable, IRect } from "../../core/types";
import XNode, { constructorNeedsArgumentsSymbol } from "../../core/XNode";
import DISingleton from "../../di/DISingleton";
import StyleRule from "../../style/StyleRule";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import { AtomControl } from "../controls/AtomControl";
import CSS from "../styles/CSS";

const popupCss = CSS(StyleRule("popup")
    .padding(5)
    .backgroundColor(Colors.white)
    .border("solid 1px lightgray")
    .borderRadius(5)
    .boxShadow("rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;")
    .display("inline-block")
);

export interface IPopupOptions {
    /**
     * Popup alignment, default is auto starting with right and below
     */
    alignment?: "left" | "right" | "auto" | "above" | "below" | "centerOfScreen";
    popupStyle?: string;
    cancelToken?: CancelToken;
}

function getParent(e: HTMLElement): AtomControl {
    let start = e;
    while (start) {
        if (start.atomControl) {
            return start.atomControl;
        }
        start = start._logicalParent ?? start.parentElement;
    }
}

export interface IPopup {
    element: HTMLElement;
    disposables: AtomDisposableList;
    dispose();
    registerDisposable(f: any);
}

export interface IDialogOptions {
    title?: string;
    parameters?: {[key: string]: any};
    cancelToken?: CancelToken;
    modal?: boolean;
}

const dialogCss = CSS(StyleRule()
    .display("block")
    .position("absolute")
    .border("solid 1px lightgray")
    .borderRadius(5)
    .top("50%")
    .left("50%")
    .transform("translate(-50%,-50%)" as any)
    .child(StyleRule(".title")
        .display("flex")
        .backgroundColor(Colors.lightGray.withAlphaPercent(0.2))
        .padding(5)
        .child(
            StyleRule(".title-text")
            .flexStretch()
        )
        .child(StyleRule(".close-button")
            .fontFamily("arial")
            .fontSize(15)
            .cursor("pointer")
            .width(30)
            .height(30)
            .backgroundColor(Colors.red.withAlphaPercent(0.1))
            .border("none")
            .borderRadius(9999)
            .textTransform("capitalize")
            .hoverBackgroundColor(Colors.red)
        )
    )
    .child(StyleRule(" * > *")
        .margin(5)
    )
    .child(StyleRule(" * > .command-bar")
        .backgroundColor(Colors.lightGray.withAlphaPercent(0.6))
        .display("flex")
        .margin(0)
        .padding(5)
        .gap(5)
    )
);

export class PopupWindow extends AtomControl {

    @BindableProperty
    public title?: string;

    private hostCreated = false;

    protected render(node: XNode, e?: any, creator?: any): void {
        if (this.hostCreated) {
            return super.render(node, e, creator);
        }
        this.hostCreated = true;
        super.render(<div class={dialogCss}>
            <div class="title title-host">
                <span class="title-text" text={Bind.oneWay(() => this.title)}/>
                <button
                    class="close-button"
                    text="x"
                    eventClick={Bind.event(() => this.viewModel.cancel())}/>
            </div>
            { node }
        </div>);
        const host = this.element.getElementsByClassName("title-host")[0];
        this.setupDragging(host as HTMLElement);
    }

    private setupDragging(tp: HTMLElement): void {
        this.bindEvent(tp, "mousedown", (startEvent: MouseEvent) => {
            startEvent.preventDefault();
            const disposables: IDisposable[] = [];
            // const offset = AtomUI.screenOffset(tp);
            const offset = { x: tp.parentElement.offsetLeft, y: tp.parentElement.offsetTop };
            const rect: IRect = { x: startEvent.clientX, y: startEvent.clientY };
            const cursor = tp.style.cursor;
            tp.style.cursor = "move";
            disposables.push(this.bindEvent(document.body, "mousemove", (moveEvent: MouseEvent) => {
                const { clientX, clientY } = moveEvent;
                const dx = clientX - rect.x;
                const dy = clientY - rect.y;

                offset.x += dx;
                offset.y += dy;

                this.element.style.left = offset.x + "px";
                this.element.style.top = offset.y + "px";
                this.element.style.transform = "";

                rect.x = clientX;
                rect.y = clientY;
            }));
            disposables.push(this.bindEvent(document.body, "mouseup", (endEvent: MouseEvent) => {
                tp.style.cursor = cursor;
                for (const iterator of disposables) {
                    iterator.dispose();
                }
            }));
        });
    }

}

@DISingleton({})
export default class PopupService {

    private id = 1001;

    public showWindow<T>(
        opener: HTMLElement,
        popupClass: IClassOf<PopupWindow>,
        popupOptions?: IDialogOptions
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const parent = getParent(opener);
            const control = new (popupClass)(parent.app, document.createElement("div"));
            const vm = control.viewModel ??= (control as any).resolve(AtomWindowViewModel);

            let resolved = false;
            const finalize = (r?) => {
                if (!resolved) {
                    resolved = true;
                    if (r) {
                        resolve(r);
                    } else {
                        reject();
                    }
                    control.element.remove();
                    control.dispose();
                }
            };

            let isModal = false;

            if (popupOptions) {
                const viewModelParameters = popupOptions.parameters;
                if (viewModelParameters) {
                    for (const key in viewModelParameters) {
                        if (Object.prototype.hasOwnProperty.call(viewModelParameters, key)) {
                            const element = viewModelParameters[key];
                            vm[key] = element;
                        }
                    }
                }
                popupOptions.cancelToken?.registerForCancel(finalize);
                isModal = popupOptions.modal;
            }

            const host = this.findHhost(opener);
            host.appendChild(control.element);

            vm.cancel = finalize;
            vm.close = finalize;

            if (!isModal) {
                this.closeHandler(host, opener, control, finalize);
            }
        });
    }

    /**
     * Display given popup attached to given opener and returns
     * disposable that can be used to dispose the popup
     * @param opener Element which opens this popup
     * @param popup Popup Element, it must be rendered within the opener's parent
     * @param options IPopupOptions
     * @returns IDisposable
     */
    public show(
        opener: HTMLElement,
        popup: HTMLElement,
        options?: IPopupOptions): IPopup {
        const container: IPopup = {
            element: document.createElement("div"),
            disposables: new AtomDisposableList(),
            registerDisposable: null,
            dispose: null,
        };
        container.registerDisposable = (f) => container.disposables.add(f);
        const popupStyle = options?.popupStyle ?? popupCss;
        container.element._logicalParent = opener;
        container.element.classList.add(popupStyle);
        container.element.appendChild(popup);
        const offset = {
            x: opener.offsetLeft,
            y: opener.offsetTop + opener.offsetHeight,
            handler: null
        };

        // find host...
        const host = this.findHhost(opener, offset);
        if (!host) {
            // tslint:disable-next-line: no-console
            console.warn("Aborting popup display as host no longer exists");
            return;
        }

        const hostHeight = host.offsetHeight
        || host.clientHeight
        || (host.firstElementChild as HTMLElement).offsetHeight;

        const style = container.element.style;
        style.position = "absolute";

        if (options?.alignment === "centerOfScreen") {
            style.left = "50%";
            style.top = "50%";
            style.transform = "translate(-50%,-50%)";
        } else {

            if (!options || options?.alignment === "auto") {

                // check where is more space??
                if (offset.x < (host.offsetWidth / 2)) {
                    style.left = offset.x + "px";
                } else {
                    style.right = `${(host.offsetWidth - (offset.x + opener.offsetWidth))}px`;
                }

                if (offset.y < (hostHeight / 2)) {
                    style.top = offset.y + "px";
                } else {
                    style.bottom = `${hostHeight - (offset.y + opener.offsetHeight)}px`;
                }

            } else {
                if (options?.alignment === "right") {
                    style.right = `${(host.offsetWidth - (opener.offsetLeft + opener.offsetWidth))}px`;
                } else {
                    style.left = offset.x + "px";
                }
            }
        }
        style.zIndex = `${this.id++}`;

        host.appendChild(container.element);
        container.dispose = () => {
            if (!container.disposables) {
                return;
            }
            container.disposables.dispose();
            const parent = getParent(opener);
            parent.dispose(container.element);
            container.element.remove();
            container.disposables = null;
        };

        this.closeHandler(host, opener, container, () => {
            container.element.remove();
            container.dispose();
        });

        const ct = options?.cancelToken;
        if (ct) {
            ct.registerForCancel(() => container.dispose());
        }

        return container;
    }

    private closeHandler(
        host: HTMLElement,
        opener: HTMLElement,
        container, close) {
        let handler: any = null;
        handler = (e: Event) => {
            let start = e.target as HTMLElement;
            while (start) {
                if (start === host) {
                    break;
                }
                if (start === opener) {
                    return;
                }
                if (start === container.element) {
                    return;
                }
                start = start.parentElement;
            }
            host.removeEventListener("click", handler);
            close();
        };
        host.addEventListener("click", handler);
    }

    private findHhost(opener: HTMLElement, offset?: {x: number, y: number}): HTMLElement {
        // find host...
        let host = opener.offsetParent as HTMLElement;
        while (host) {
            const current = host;
            if (host === document.body) {
                // we have reached top...
                break;
            }
            host = host.offsetParent as HTMLElement;
            if (host.classList.contains("page-host")) {
                // we have reached popup host...
                host = current;
                break;
            }
            if (!host) {
                continue;
            }
            offset.x += host.offsetLeft;
            offset.y += host.offsetTop;
        }
        return host;
    }

}
