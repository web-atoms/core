import { App } from "../../App";
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

// let lastTarget = null;
document.body.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).offsetParent) {
        PopupService.lastTarget = e.target as HTMLElement;
    }
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
    .boxShadow("0 0 20px 1px rgb(0 0 0 / 75%)")
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

export class PopupControl extends AtomControl {

    public static showControl<T>(
        opener: HTMLElement | AtomControl,
        options?: IPopupOptions): Promise<T> {
        let openerElement: HTMLElement;
        let app: App;
    
        if (opener instanceof AtomControl) {
            openerElement = opener.element;
            app = opener.app;
        } else {
            openerElement = opener;
            let start = opener;
            while (!start.atomControl) {
                start = start.parentElement;
            }
            if (!start) {
                return Promise.reject("Could not create popup as target is not attached")
            }
            app = start.atomControl.app;
        }
        const popup = new this(app);
        
        const p = PopupService.show(openerElement, popup.element, options);
        // since popup will be children of openerElement
        // on dispose(popupElement), popup will be disposed automatically
        // p.registerDisposable(popup);
        return new Promise(((resolve, reject) => {
            let resolved = false;
            popup.close = (r) => {
                if (resolved) {
                    return;
                }
                resolved = true;
                resolve(r);
                p.dispose();
            };

            popup.cancel = (e) => {
                if (resolved) {
                    return;
                }
                resolved = true;
                reject(e);
                p.dispose();
            };
        }));
    }

    public close: (r?) => void;

    public cancel: (r?) => void;

}

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
        return PopupService.showWindow<T>(PopupService.lastTarget, window as any, options);
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
        return PopupService.showWindow<T>(PopupService.lastTarget, window as any, options);
    }

    @BindableProperty
    public title?: string;

    public close: (r?) => void;

    public cancel: (r?) => void;

    private hostCreated = false;

    protected render(node: XNode, e?: any, creator?: any): void {
        if (this.hostCreated) {
            return super.render(node, e, creator);
        }
        this.hostCreated = true;
        super.render(<div
            data-popup-window="popup-window"
            class={dialogCss}
            title={Bind.oneWay(() => this.viewModel.title)}>
            <div class="title title-host">
                <span class="title-text" text={Bind.oneWay(() => this.title)}/>
                <button
                    class="popup-close-button"
                    text="x"
                    eventClick={Bind.event(() => this.cancel())}/>
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

function findHostAndPosition(opener: HTMLElement) {
    let root = opener;
    const body = document.body;
    let rect = opener.getBoundingClientRect();
    const offset = {
        x: rect.left,
        y: rect.top,
        handler: null,
        root
    };
    do {
        root = root.parentElement;
        if (root === body) {
            break;
        }
        if (root.parentElement.classList.contains("page-host")) {
            break;
        }
        if (root.classList.contains("popup-host")) {
            break;
        }
        if (root.dataset.popUpHost === "yes") {
            break;
        }
    } while (true);
    rect = root.getBoundingClientRect();
    offset.x -= rect.x;
    offset.y -= rect.y;
    offset.root = root;
    return offset;
}

function findHost(opener: HTMLElement, offset?: {x: number, y: number}): HTMLElement {

    // let us find scrollable target offsetParent

    // find host...
    let host = opener.offsetParent as HTMLElement;
    while (host) {
        const current = host;
        if (host === document.body) {
            // we have reached top...
            return host;
        }
        if (host.classList.contains("popup-host")) {
            // let us use this..
            return host;
        }
        if (host.dataset.popUpHost === "yes") {
            return host;
        }
        host = host.offsetParent as HTMLElement;
        if (host.classList.contains("page-host")) {
            // we have reached popup host...
            host = current;
            return host;
        }
        if (!host) {
            continue;
        }
        if (!offset) {
            continue;
        }
        offset.x += host.offsetLeft;
        offset.y += host.offsetTop - (host.offsetParent?.scrollTop ?? 0);
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
        close();
    };
    document.body.addEventListener("click", handler);
    container.registerDisposable(() => document.body.removeEventListener("click", handler));
}

let popupId = 1001;

let lastTarget = {
    element: null,
    x: 10,
    y: 10
};
export default class PopupService {

    public static get lastTarget() {
        const { element, x = 0, y = 0 } = lastTarget;
        if (element?.isConnected) {
            return element;
        }
        const e = document.elementFromPoint(x, y) as HTMLElement;
        PopupService.lastTarget = e;
        return e;
    }

    public static set lastTarget(element: HTMLElement) {
        const rect = element.getBoundingClientRect();
        lastTarget = {
            element,
            x: rect.left + (rect.width / 2),
            y: rect.top + (rect.height / 2)
        };
    }

    public static showWindow<T>(
        opener: HTMLElement,
        popupClass: IClassOf<PopupWindow>,
        popupOptions?: IDialogOptions
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const previousTarget = opener;
            const parent = getParent(opener);
            const control = new (popupClass)(parent.app, document.createElement("div"));
            const vm = control.viewModel ?? control;
            let element = control.element;

            let resolved = false;
            const close = (r?) => {
                // this is to allow binding events
                // to refresh the data
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        setTimeout(resolve,1,r);
                        // if control's element is null
                        // control has been disposed and no need to dispose it
                        if (control.element) {
                            control.element.remove();
                            control.dispose();
                        }
                        element?.remove();
                        element = undefined;
                        PopupService.lastTarget = previousTarget;
                    }
                }, 1);
            };

            const cancel = (r?) => {
                // this is to allow binding events
                // to refresh the data
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        setTimeout(reject ,1 ,r ?? "cancelled");
                        // if control's element is null
                        // control has been disposed and no need to dispose it
                        if (control.element) {
                            control.element.remove();
                            control.dispose();
                        }
                        element?.remove();
                        element = undefined;
                        PopupService.lastTarget = previousTarget;
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
                            const e = viewModelParameters[key];
                            vm[key] = e;
                        }
                    }
                }
                popupOptions.cancelToken?.registerForCancel(cancel);
                isModal = popupOptions.modal;
            }

            const host = findHost(opener);
            host.appendChild(control.element);

            vm.cancel = cancel;
            vm.close = close;
            if (vm !== control) {
                control.cancel = cancel;
                control.close = close;
            }

            if (!isModal) {
                closeHandler(host, opener, control, cancel);
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
        const offset = findHostAndPosition(opener);
        const host = offset.root;
        const hostHeight = host.offsetHeight
        || host.clientHeight
        || (host.firstElementChild as HTMLElement).offsetHeight;

        const style = container.element.style;
        style.position = "absolute";
        offset.y += opener.offsetHeight;

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
            container.disposables.dispose();
            const parent = getParent(opener);
            parent.dispose(container.element);
            container.element.remove();
            container.disposables = null;
            PopupService.lastTarget = previousTarget;
        };

        closeHandler(host, opener, container, () => {
            const e = container.element;
            container.dispose();
            e.remove();
        });

        const ct = options?.cancelToken;
        if (ct) {
            ct.registerForCancel(() => container.dispose());
        }

        return container;
    }

}
