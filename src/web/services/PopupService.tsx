import { AtomDisposableList } from "../../core/AtomDisposableList";
import Bind from "../../core/Bind";
import { BindableProperty } from "../../core/BindableProperty";
import Colors from "../../core/Colors";
import sleep from "../../core/sleep";
import { CancelToken, IClassOf, IDisposable, IRect } from "../../core/types";
import XNode, { constructorNeedsArgumentsSymbol } from "../../core/XNode";
import DISingleton from "../../di/DISingleton";
import StyleRule from "../../style/StyleRule";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import { AtomControl } from "../controls/AtomControl";
import CSS from "../styles/CSS";

let lastTarget = null;
document.body.addEventListener("click", (e) => {
    lastTarget = e.target;
});

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
    .backgroundColor(Colors.white)
    .top("50%")
    .left("50%")
    .transform("translate(-50%,-50%)" as any)
    .child(StyleRule(".title")
        .display("flex")
        .backgroundColor(Colors.lightGray.withAlphaPercent(0.2))
        .padding(5)
        .child(
            StyleRule(".title-text")
            .cursor("move")
            .flexStretch()
        )
        .child(StyleRule(".popup-close-button")
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
        .nested(StyleRule("button")
            .borderWidth(1)
            .borderRadius(9999)
            .padding(5)
            .paddingLeft(10)
            .paddingRight(10)
        )
    )
);

export class PopupWindow extends AtomControl {

    public static async showWindow<T>(options?: IDialogOptions): Promise<T>;
    public static async showWindow<T>(window: IClassOf<PopupWindow>, options?: IDialogOptions): Promise<T>;
    public static async showWindow<T>(
        window: IClassOf<PopupWindow> | IDialogOptions,
        options?: IDialogOptions): Promise<T> {
        if (arguments.length <= 2) {
            options = arguments[0];
            window = this;
        }
        // this will force lastTarget to be set
        await sleep(1);
        return PopupService.showWindow<T>(lastTarget, window as any, options);
    }

    public static async showModal<T>(options?: IDialogOptions): Promise<T>;
    public static async showModal<T>(window: IClassOf<PopupWindow>, options?: IDialogOptions): Promise<T>;
    public static async showModal<T>(
        window: IClassOf<PopupWindow> | IDialogOptions,
        options?: IDialogOptions): Promise<T> {
        if (arguments.length <= 2) {
            options = arguments[0];
            window = this;
        }
        options ??= {};
        options.modal ??= true;
        // this will force lastTarget to be set
        await sleep(1);
        return PopupService.showWindow<T>(lastTarget, window as any, options);
    }

    @BindableProperty
    public title?: string;

    private hostCreated = false;

    protected render(node: XNode, e?: any, creator?: any): void {
        if (this.hostCreated) {
            return super.render(node, e, creator);
        }
        this.hostCreated = true;
        super.render(<div class={dialogCss} title={Bind.oneWay(() => this.viewModel.title)}>
            <div class="title title-host">
                <span class="title-text" text={Bind.oneWay(() => this.title)}/>
                <button
                    class="popup-close-button"
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

function findHost(opener: HTMLElement, offset?: {x: number, y: number}): HTMLElement {
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
        if (!offset) {
            continue;
        }
        offset.x += host.offsetLeft;
        offset.y += host.offsetTop;
    }
    return host;
}

function closeHandler(
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

let popupId = 1001;

export default class PopupService {

    public static showWindow<T>(
        opener: HTMLElement,
        popupClass: IClassOf<PopupWindow>,
        popupOptions?: IDialogOptions
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const previousTarget = opener;
            const parent = getParent(opener);
            const control = new (popupClass)(parent.app, document.createElement("div"));
            const vm = control.viewModel ??= (control as any).resolve(AtomWindowViewModel);

            let resolved = false;
            const finalize = (r?) => {
                // this is to allow binding events
                // to refresh the data
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        lastTarget = previousTarget;
                        if (r) {
                            resolve(r);
                        } else {
                            reject("cancelled");
                        }
                        control.element.remove();
                        control.dispose();
                    }
                }, 1);
            };

            let isModal = false;

            if (popupOptions) {
                if (popupOptions.title) {
                    vm.title = popupOptions.title;
                }
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

            const host = findHost(opener);
            host.appendChild(control.element);

            vm.cancel = finalize;
            vm.close = finalize;

            if (!isModal) {
                closeHandler(host, opener, control, finalize);
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
    public static show(
        opener: HTMLElement,
        popup: HTMLElement,
        options?: IPopupOptions): IPopup {
        const previousTarget = opener;
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
        const host = findHost(opener, offset);
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
                    style.top = `${offset.y - opener.offsetHeight}px`;
                    style.transform = "translate(0, -100%)";
                }

            } else {
                if (options?.alignment === "right") {
                    style.right = `${(host.offsetWidth - (opener.offsetLeft + opener.offsetWidth))}px`;
                } else {
                    style.left = offset.x + "px";
                }
            }
        }
        style.zIndex = `${popupId++}`;

        host.appendChild(container.element);
        container.dispose = () => {
            if (!container.disposables) {
                return;
            }
            lastTarget = previousTarget;
            container.disposables.dispose();
            const parent = getParent(opener);
            parent.dispose(container.element);
            container.element.remove();
            container.disposables = null;
        };

        closeHandler(host, opener, container, () => {
            container.element.remove();
            container.dispose();
        });

        const ct = options?.cancelToken;
        if (ct) {
            ct.registerForCancel(() => container.dispose());
        }

        return container;
    }

}
