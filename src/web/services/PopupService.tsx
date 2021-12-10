import { AtomDisposableList } from "../../core/AtomDisposableList";
import Colors from "../../core/Colors";
import { CancelToken, IClassOf } from "../../core/types";
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
    controlClass?: IClassOf<AtomControl>;
}

const dialogCss = CSS(StyleRule()
    .display("block")
    .position("absolute")
    .padding(5)
    .border("solid 1px lightgray")
    .borderRadius(5)
    .top("50%")
    .left("50%")
    .transform("translate(-50%,-50%)" as any)
    .child(StyleRule(".title")
        .display("flex")
        .child(
            StyleRule(".title-text")
            .flexStretch()
        )
        .child(StyleRule(".close-button")
            .fontFamily("arial")
            .fontSize(10)
            .padding(5)
            .backgroundColor(Colors.transparent)
            .border("none")
        )
    )
);

class PopupWindowControl extends AtomControl {

}

export function PopupWindow({}, ... nodes: XNode[]) {
    return <PopupWindowControl>
        { ... nodes }
    </PopupWindowControl>;
}

@DISingleton({})
export default class PopupService {

    private id = 1001;

    public showWindow<T>(
        opener: HTMLElement,
        {
            title,
            parameters,
            cancelToken,
            controlClass
        }: IDialogOptions,
        ... nodes: XNode[]
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const parent = getParent(opener);
            const control = new (controlClass ?? AtomControl)(parent.app, document.createElement("div"));
            const vm = control.viewModel ??= (control as any).resolve(AtomWindowViewModel);
            for (const key in parameters) {
                if (Object.prototype.hasOwnProperty.call(parameters, key)) {
                    const element = parameters[key];
                    vm[key] = element;
                }
            }
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

            (control as any).render(<div class={dialogCss}>
                <div class="title">
                    <span class="title-text" text={title}/>
                    <button
                        class="close-button"
                        text="x"
                        eventClick={() => finalize()}/>
                </div>
                { ... nodes}
            </div>);

            const host = this.findHhost(opener);
            host.appendChild(control.element);
            let resolved = false;

            vm.cancel = finalize;
            vm.close = finalize;
            cancelToken?.registerForCancel(finalize);

            this.closeHandler(host, opener, control, finalize);
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
            host.removeEventListener("click", handler);
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
