import { App } from "../../App";
import { AtomDisposableList } from "../../core/AtomDisposableList";
import Bind from "../../core/Bind";
import { BindableProperty } from "../../core/BindableProperty";
import Colors from "../../core/Colors";
import { getOwnInheritedProperty } from "../../core/InheritedProperty";
import sleep from "../../core/sleep";
import { CancelToken, IClassOf, IDisposable, IRect } from "../../core/types";
import XNode, { constructorNeedsArgumentsSymbol } from "../../core/XNode";
import DISingleton from "../../di/DISingleton";
import StyleRule from "../../style/StyleRule";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import { AtomControl } from "../controls/AtomControl";
import CSS from "../styles/CSS";

import PopupWindowA, { ConfirmPopup } from "./PopupWindow";

export const PopupWindow = PopupWindowA;

// let lastTarget = null;
document.body.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).offsetParent) {
        PopupService.lastTarget = e.target as HTMLElement;
    }
});

CSS(StyleRule()
    .custom("contain", "none !important")
, "[data-force-contain=none]");

CSS(StyleRule()
    .position("relative")
    .height(0)
    .width(0)
    .left(0)
    .child(StyleRule("*")
        .position("absolute")
        .left(0)
        .top(0)
        .padding(5)
        .maxHeight(300)
        .overflow("auto")
        .borderRadius(5)
        .backgroundColor(Colors.white)
        .zIndex(200)
        .defaultBoxShadow()
    )
, "*[data-inline-popup=left]");

CSS(StyleRule()
    .position("absolute")
    .height(0)
    .width(0)
    .right(0)
    .child(StyleRule("*")
        .position("absolute")
        .right(0)
        .top(0)
        .padding(5)
        .maxHeight(300)
        .overflow("auto")
        .borderRadius(5)
        .backgroundColor(Colors.white)
        .zIndex(200)
        .defaultBoxShadow()
    )
, "*[data-inline-popup=right]");

CSS(StyleRule()
    .position("relative")
    .height(0)
    .width(0)
    .left(0)
    .child(StyleRule("*")
        .position("absolute")
        .left(0)
        .top(0)
        .padding(5)
        .maxHeight(300)
        .overflow("auto")
        .borderRadius(5)
        .backgroundColor(Colors.white)
        .zIndex(200)
        .defaultBoxShadow()
    )
, "*[data-inline-popup=inline-left]");

CSS(StyleRule("popup")
    .position("fixed")
    .left("50%")
    .top("50%")
    .transform("translate(-50%, -50%)" as any)
    .zIndex(10000)
    .padding(5)
    .backgroundColor(Colors.white)
    .border("solid 1px lightgray")
    .borderRadius(5)
    .boxShadow("rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;")
    .display("inline-block")
, "*[data-center-popup]");


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
    alignment?: "bottomLeft" | "bottomRight" | "topRight" | "right" | "auto" | "above" | "below" | "centerOfScreen";
    popupStyle?: string;
    cancelToken?: CancelToken;

    /**
     * Default is "close" for popup control to avoid cancel exceptions.
     */
    onClick?: "close" | "cancel" | null | undefined;

    /**
     * Used by PopupControl to overwrite parent Element
     */
    parentElement?: HTMLElement;
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

    width?: number | string;
    height?: number | string;

    maxWidth?: number | string;
    maxHeight?: number | string;

    minWidth?: number | string;
    minHeight?: number | string;

    maximize?: boolean;
}

// CSS(StyleRule()
//     .position("absolute")
//     .border("solid 1px lightgray")
//     .borderRadius(5)
//     .backgroundColor(Colors.white)
//     .top("50%")
//     .left("50%")
//     .transform("translate(-50%,-50%)" as any)
//     .boxShadow("0 0 20px 1px rgb(0 0 0 / 75%)")
//     .display("grid")
//     .alignItems("center")
//     .justifyItems("center")
//     .gridTemplateRows("auto 1fr")
//     .gridTemplateColumns("1fr")
//     .opacity("0")
//     .transition("opacity 0.3s cubic-bezier(0.55, 0.09, 0.97, 0.32)")
//     .and(StyleRule("[data-ready=true]")
//         .opacity("1")
//     )
//     .and(StyleRule("[data-dragging=true]")
//         .opacity("0.5")
//     )
//     .child(StyleRule(".title")
//         .justifySelf("stretch")
//         .display("flex")
//         .minWidth(0)
//         .backgroundColor(Colors.lightGray.withAlphaPercent(0.2))
//         .padding(5)
//         .alignItems("center")
//         .justifyItems("center")
//         .child(
//             StyleRule(".title-text")
//             .cursor("move")
//             .flexStretch()
//             .textEllipsis()
//         )
//         .child(StyleRule("*")
//             .flex("1 1 100%")
//         )
//         .child(StyleRule(".popup-close-button")
//             .fontFamily("arial")
//             .fontSize(15)
//             .flex("1 0 auto")
//             .cursor("pointer")
//             .width(30)
//             .height(30)
//             .backgroundColor(Colors.red.withAlphaPercent(0.1))
//             .border("none")
//             .borderRadius(9999)
//             .textTransform("capitalize")
//             .hoverBackgroundColor(Colors.red)
//         )
//     )
//     .child(StyleRule("*[data-window-content=window-content]")
//         .margin(5)
//         .alignSelf("stretch")
//         .justifySelf("stretch")
//         .flexStretch()
//         .overflow("auto")
//         // This is done to avoid absolute position
//         // to run out of content area
//         .position("relative")
//         // .display("flex")
//         // .child(StyleRule("*")
//         //     .flex("1 1 100%")
//         // )
//         // .and(StyleRule("[data-window-content-fill] > *")
//         //     .maximizeAbsolute()
//         // )
//     )
//     .child(StyleRule(" * > .command-bar")
//         .backgroundColor(Colors.lightGray.withAlphaPercent(0.6))
//         .display("flex")
//         .margin(0)
//         .padding(5)
//         .gap(5)
//         .nested(StyleRule("button")
//             .borderWidth(1)
//             .borderRadius(9999)
//             .padding(5)
//             .paddingLeft(10)
//             .paddingRight(10)
//         )
//     )
// , "*[data-popup-window=popup-window]");

export class PopupControl extends AtomControl {

    public static showControl<T>(
        opener: HTMLElement | AtomControl,
        {
            onClick = "close",
            ... options
        }: IPopupOptions = {}): Promise<T> {
        let openerElement: HTMLElement = options?.parentElement;
        let app: App;

        if (opener instanceof AtomControl) {
            openerElement ??= opener.element;
            app = opener.app;
        } else {
            openerElement ??= opener;
            let start = opener;
            while (!start.atomControl) {
                start = start.parentElement;
            }
            if (!start) {
                return Promise.reject("Could not create popup as target is not attached");
            }
            app = start.atomControl.app;
        }
        const popup = new this(app);
        if (onClick === "close") {
            popup.bindEvent(popup.element, "click", () => setTimeout(() => popup.close(), 10));
        } else if (onClick === "cancel") {
            popup.bindEvent(popup.element, "click", () => setTimeout(() => popup.cancel(), 10));
        }
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
                PopupService.lastTarget = openerElement;
                resolve(r);
                p.dispose();
            };

            popup.cancel = (e) => {
                if (resolved) {
                    return;
                }
                resolved = true;
                PopupService.lastTarget = openerElement;
                reject(e);
                p.dispose();
            };
        }));
    }

    public close: (r?) => void;

    public cancel: (r?) => void;

}

// export class PopupWindow extends AtomControl {

//     public static async showWindow<T>(options?: IDialogOptions): Promise<T>;
//     public static async showWindow<T>(window: IClassOf<PopupWindow>, options?: IDialogOptions): Promise<T>;
//     public static async showWindow<T>(
//         window: IClassOf<PopupWindow> | IDialogOptions,
//         options?: IDialogOptions): Promise<T> {
//         if (arguments.length <= 1) {
//             options = arguments[0];
//             window = this;
//         }
//         // this will force lastTarget to be set
//         await sleep(1);
//         return PopupService.showWindow<T>(PopupService.lastTarget, window as any, options);
//     }

//     public static async showModal<T>(options?: IDialogOptions): Promise<T>;
//     public static async showModal<T>(window: IClassOf<PopupWindow>, options?: IDialogOptions): Promise<T>;
//     public static async showModal<T>(
//         window: IClassOf<PopupWindow> | IDialogOptions,
//         options?: IDialogOptions): Promise<T> {
//         if (arguments.length <= 1) {
//             options = arguments[0];
//             window = this;
//         }
//         options ??= {};
//         options.modal ??= true;
//         // this will force lastTarget to be set
//         await sleep(1);
//         return PopupService.showWindow<T>(PopupService.lastTarget, window as any, options);
//     }

//     @BindableProperty
//     public title?: string;

//     public viewModelTitle?: string;

//     public close: (r?) => void;

//     public cancel: (r?) => void;

//     public titleRenderer: () => XNode;

//     public closeButtonRenderer: () => XNode;

//     @BindableProperty
//     public closeWarning: string;

//     protected init() {
//         // do nothing...
//     }

//     protected async requestCancel() {
//         if (this.closeWarning) {
//             if (!await ConfirmPopup.confirm({
//                 message : this.closeWarning
//             })) {
//                 return;
//             }
//         }
//         this.cancel();
//     }

//     protected preCreate(): void {
//         this.title = null;
//         this.viewModelTitle = null;
//         const handler = (e: KeyboardEvent) => {
//             if (e.key === "Escape") {
//                 this.app.runAsync(() => this.requestCancel());
//                 e.preventDefault();
//                 return;
//             }
//         };
//         this.bindEvent(this.element, "keydown", handler);
//         // document.body.addEventListener("keydown", handler);
//         // this.registerDisposable({
//         //     dispose() {
//         //         document.body.removeEventListener("keydown", handler);
//         //     }
//         // });
//         this.element.dataset.popupWindow = "popup-window";

//         setTimeout((p) => {
//             p.dataset.ready = "true";
//         }, 10, this.element);
//     }

//     protected render(node: XNode, e?: any, creator?: any): void {
//         this.render = super.render;
//         const titleContent = this.titleRenderer?.() ?? <span
//             class="title-text" text={Bind.oneWay(() => this.title || this.viewModelTitle)}/>;
//         const closeButton = this.closeButtonRenderer?.() ?? <button
//             class="popup-close-button"
//             text="x"
//             eventClick={Bind.event(() => this.requestCancel())}/>;
//         const a = node.attributes ??= {};
//         a["data-window-content"] = "window-content";
//         const extracted = this.extractControlProperties(node);
//         super.render(<div
//             viewModelTitle={Bind.oneWay(() => this.viewModel.title)}
//             { ... extracted }>
//             <div class="title title-host">
//                 { titleContent }
//                 { closeButton }
//             </div>
//             { node }
//         </div>);

//         this.runAfterInit(() => {
//             if (!this.element) {
//                 return;
//             }
//             const host = this.element.getElementsByClassName("title-host")[0];
//             this.setupDragging(host as HTMLElement);
//             // this.element may become null if it was immediately
//             // closed, very rare case, but possible if
//             // supplied cancelToken was cancelled
//             const anyAutofocus = this.element.querySelector(`*[autofocus]`);
//             if (!anyAutofocus) {
//                 const windowContent = this.element.querySelector("[data-window-content]");
//                 if (windowContent) {
//                     const firstInput = windowContent.querySelector("input,button,a") as HTMLInputElement;
//                     if (firstInput) {
//                         firstInput.focus();
//                         return;
//                     }
//                 }

//                 const cb = this.element.querySelector(".popup-close-button") as HTMLButtonElement;
//                 if (cb) {
//                     cb.focus();
//                 }
//                 return;
//             }
//         });
//     }

//     protected setupDragging(tp: HTMLElement): void {
//         this.bindEvent(tp, "mousedown", (startEvent: MouseEvent) => {
//             if ((startEvent.target as HTMLElement).tagName === "BUTTON") {
//                 return;
//             }
//             startEvent.preventDefault();
//             const disposables: IDisposable[] = [];
//             // const offset = AtomUI.screenOffset(tp);
//             const element = this.element;
//             const offset = { x: element.offsetLeft, y: element.offsetTop };
//             if (element.style.transform !== "none") {
//                 offset.x -= element.offsetWidth / 2;
//                 offset.y -= element.offsetHeight / 2;
//                 element.style.left = offset.x + "px";
//                 element.style.top = offset.y + "px";
//                 element.style.transform = "none";
//             }
//             this.element.dataset.dragging = "true";
//             const rect: IRect = { x: startEvent.clientX, y: startEvent.clientY };
//             const cursor = tp.style.cursor;
//             tp.style.cursor = "move";
//             disposables.push(this.bindEvent(document.body, "mousemove", (moveEvent: MouseEvent) => {
//                 const { clientX, clientY } = moveEvent;
//                 const dx = clientX - rect.x;
//                 const dy = clientY - rect.y;

//                 const finalX = offset.x + dx;
//                 const finalY = offset.y + dy;
//                 if (finalX < 5 || finalY < 5) {
//                     return;
//                 }

//                 offset.x = finalX;
//                 offset.y = finalY;

//                 this.element.style.left = offset.x + "px";
//                 this.element.style.top = offset.y + "px";

//                 rect.x = clientX;
//                 rect.y = clientY;
//             }));
//             disposables.push(this.bindEvent(document.body, "mouseup", (endEvent: MouseEvent) => {
//                 tp.style.cursor = cursor;
//                 this.element.removeAttribute("data-dragging");
//                 for (const iterator of disposables) {
//                     iterator.dispose();
//                 }
//             }));
//         });
//     }

// }

// // @ts-ignore
// delete PopupWindow.prototype.init;

CSS(StyleRule()
    .display("grid")
    .nested(StyleRule(".yes")
        .borderRadius(9999)
        .paddingLeft(10)
        .paddingRight(10)
        .borderWidth(1)
        .borderColor(Colors.transparent)
        .margin(5)
        .marginRight(10)
        .backgroundColor(Colors.lightGreen)
    )
    .nested(StyleRule(".no")
        .borderRadius(9999)
        .paddingLeft(10)
        .paddingRight(10)
        .borderWidth(1)
        .borderColor(Colors.transparent)
        .margin(5)
        .marginRight(10)
        .backgroundColor(Colors.red)
        .color(Colors.white)
    )
    .nested(StyleRule(".cancel")
        .borderRadius(9999)
        .paddingLeft(10)
        .paddingRight(10)
        .borderWidth(1)
        .borderColor(Colors.transparent)
        .margin(5)
        .marginRight(10)
        .backgroundColor(Colors.gray)
    )
    .child(StyleRule("[data-element=message]")
        .overflow("auto")
    )
, "div[data-confirm-popup=confirm-popup]");

// class ConfirmPopup extends PopupWindow {

//     public static async confirm({
//         message,
//         title = "Confirm",
//         yesLabel = "Yes",
//         noLabel = "No",
//         cancelLabel = null
//     }): Promise<boolean> {
//         return PopupService.confirm({ title, message, yesLabel, noLabel,  cancelLabel});
//     }

//     public message: string;

//     public messageRenderer: () => XNode;

//     public yesLabel: string;

//     public noLabel: string;

//     public cancelLabel: string;

//     protected preCreate(): void {
//         super.preCreate();
//         this.yesLabel = "Yes";
//         this.noLabel = "No";
//         this.cancelLabel = null;
//     }

//     protected requestCancel(): Promise<void> {
//         this.cancel();
//         return Promise.resolve();
//     }

//     protected render(node: XNode, e?: any, creator?: any) {
//         this.render = super.render;
//         this.element.dataset.confirmPopup = "confirm-popup";
//         this.closeButtonRenderer = () => <div/>;
//         const extracted = this.extractControlProperties(node);
//         const na = node.attributes ??= {};
//         na["data-element"] = "message";
//         super.render(<div { ... extracted }>
//             { node }
//             <div data-element="buttons">
//                 <button
//                     class="yes"
//                     autofocus={true}
//                     text={Bind.oneWay(() => this.yesLabel)}
//                     eventClick={() => this.close(true)}
//                     style-display={Bind.oneWay(() => !!this.yesLabel)}
//                     />
//                 <button
//                     class="no"
//                     text={Bind.oneWay(() => this.noLabel)}
//                     eventClick={() => this.close(false)}
//                     style-display={Bind.oneWay(() => !!this.noLabel)}
//                     />
//                 <button
//                     class="cancel"
//                     text={Bind.oneWay(() => this.cancelLabel)}
//                     eventClick={() => this.requestCancel()}
//                     style-display={Bind.oneWay(() => !!this.cancelLabel)}
//                     />
//             </div>
//         </div>);
//     }

// }

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

export const disableContain = (ce: HTMLElement) => {
    const containNoneList: HTMLElement[] = [];
    while (ce) {
        const style = window.getComputedStyle(ce);
        const isNotNone = style.contain !== "none";
        if (isNotNone) {
            ce.dataset.forceContain = "none";
            containNoneList.push(ce);
        }
        ce = ce.parentElement;
    }

    return () => {
        for (const iterator of containNoneList) {
            delete iterator.dataset.forceContain;
        }
    };
};

function closeHandler(
    host: HTMLElement,
    opener: HTMLElement,
    container, close) {
    let handler: any = null;
    handler = (e: Event) => {

        // dispatch event once again...
        if(container?.element) {
            const ce = new CustomEvent("outsideClick", { detail: e, cancelable: true, bubbles: true});
            (container.element as HTMLElement).dispatchEvent(ce);
            if (ce.defaultPrevented) {
                return;
            }
        }

        let start = e.target as HTMLElement;
        if (e.defaultPrevented) {
            return;
        }
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
        e.preventDefault();
        e.stopImmediatePropagation?.();
    };
    document.body.addEventListener("click", handler, true);
    container.registerDisposable(() => document.body.removeEventListener("click", handler, true));
    const onBack = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation?.();
        e.stopPropagation();
        close();
    };
    window.addEventListener("backButton", onBack, true);
    container.registerDisposable(() => window.removeEventListener("backButton", onBack, true));

    setTimeout(() => {
        container.registerDisposable(disableContain(container.element));
    }, 10);

}

let popupId = 1001;

let lastTarget = {
    element: null,
    x: 10,
    y: 10
};

export interface IPopupAlertOptions {
    message: string | XNode;
    title?: string;
    yesLabel?: string;
    noLabel?: string;
    cancelLabel?: string;
}
export default class PopupService {

    public static defaultElementTarget: HTMLElement;

    public static get lastTarget() {
        const { element, x = 0, y = 0 } = lastTarget;
        if (element?.isConnected) {
            return element;
        }
        let e = document.elementFromPoint?.(x, y) as HTMLElement ?? document.body;
        if (this.defaultElementTarget?.isConnected
            && (e === document.documentElement || e === document.body)) {
                e = this.defaultElementTarget;
            }
        PopupService.lastTarget = e;
        return e;
    }

    public static set lastTarget(element: HTMLElement) {
        if (!element.isConnected) {
            return;
        }
        if (element === document.documentElement) {
            return;
        }
        if (!this.defaultElementTarget) {
            this.defaultElementTarget = element;
        }
        const rect = element.getBoundingClientRect();
        lastTarget = {
            element,
            x: rect.left + (rect.width / 2),
            y: rect.top + (rect.height / 2)
        };
    }

    public static async alert({
        message,
        title = "Alert",
        yesLabel = "Ok"
    }: IPopupAlertOptions): Promise<boolean> {
        try {
            const popup = class extends ConfirmPopup {
                protected create(): void {
                    this.render(<div>
                        { message instanceof XNode ? message : <div text={message}/> }
                    </div>);
                }
            };
            return await popup.showModal<boolean>({
                parameters: {
                    message,
                    yesLabel,
                    noLabel: ""
                },
                title
            });
        } catch (e) {
            if (CancelToken.isCancelled(e)) {
                return false;
            }
            throw e;
        }
    }

    public static async confirm({
        message,
        title = "Confirm",
        yesLabel = "Yes",
        noLabel = "No",
        cancelLabel = null
    }: IPopupAlertOptions): Promise<boolean> {
        try {
            const popup = class extends ConfirmPopup {
                protected create(): void {
                    this.render(<div>
                        { message instanceof XNode ? message : <div text={message}/> }
                    </div>);
                }
            };
            return await popup.showModal<boolean>({
                parameters: {
                    message,
                    yesLabel,
                    noLabel,
                    cancelLabel
                },
                title
            });
        } catch (e) {
            if (CancelToken.isCancelled(e)) {
                return false;
            }
            throw e;
        }
    }

    public static showWindow<T>(
        opener: HTMLElement,
        popupClass: typeof PopupWindow,
        popupOptions?: IDialogOptions
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const activeElement = document.activeElement as any;
            const previousTarget = opener;
            const parent = AtomControl.from(opener);
            const control = new (popupClass)(parent.app, document.createElement("div"));
            const vm = getOwnInheritedProperty(control, "viewModel")
                ?? ("parameters" in  control ? (control as any).parameters ??= {} : control);
            let element = control.element;
            element.style.zIndex = `${popupId++}`;
            let resolved = false;
            const close = (r?) => {
                // this is to allow binding events
                // to refresh the data
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        setTimeout(resolve, 1, r);
                        // if control's element is null
                        // control has been disposed and no need to dispose it
                        if (control.element) {
                            control.element.remove();
                            control.dispose();
                        }
                        element?.remove();
                        element = undefined;
                        PopupService.lastTarget = previousTarget;
                        try {
                            activeElement?.focus();
                        } catch (error) {
                            // tslint:disable-next-line: no-console
                            console.error(error);
                        }
                    }
                }, 1);
            };

            const cancel = (r?) => {
                // this is to allow binding events
                // to refresh the data
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        setTimeout(reject , 1 , r ?? "cancelled");
                        // if control's element is null
                        // control has been disposed and no need to dispose it
                        if (control.element) {
                            control.element.remove();
                            control.dispose();
                        }
                        element?.remove();
                        element = undefined;
                        PopupService.lastTarget = previousTarget;
                        try {
                            activeElement?.focus();
                        } catch (error) {
                            // tslint:disable-next-line: no-console
                            console.error(error);
                        }
                    }
                }, 1);
            };

            let isModal = false;

            if (popupOptions) {
                const {
                    width,
                    height,
                    minHeight,
                    maxHeight,
                    minWidth,
                    maxWidth,
                    maximize,
                    title,
                    parameters,
                    cancelToken,
                    modal
                } = popupOptions;
                if (title) {
                    vm.title = title;
                }

                let widthSet = false;
                let heightSet = false;

                if (maximize) {
                    element.style.width = "95%";
                    element.style.height = "95%";
                    widthSet = heightSet = true;
                } else {
                    if (width) {
                        element.style.width = typeof width === "number" ? width + "px" : width;
                        widthSet = true;
                    }
                    if (height) {
                        element.style.height = typeof height === "number" ? height + "px" : height;
                        heightSet = true;
                    }
                    if (minWidth) {
                        element.style.minWidth = typeof minWidth === "number" ? minWidth + "px" : minWidth;
                        widthSet = true;
                    }
                    if (minHeight) {
                        element.style.minHeight = typeof minHeight === "number" ? minHeight + "px" : minHeight;
                        heightSet = true;
                    }
                    if (maxWidth) {
                        element.style.maxWidth = typeof maxWidth === "number" ? maxWidth + "px" : maxWidth;
                        widthSet = true;
                    } else {
                        element.style.maxWidth = "95%";
                    }
                    if (maxHeight) {
                        element.style.maxHeight = typeof maxHeight === "number" ? maxHeight + "px" : maxHeight;
                        heightSet = true;
                    } else {
                        element.style.maxHeight = "95%";
                    }
                }

                if (!widthSet) {
                    element.style.maxWidth = "95%";
                    element.style.minWidth = "300px";
                }
                if (!heightSet) {
                    element.style.maxHeight = "95%";
                    element.style.minHeight = "100px";
                }

                if (parameters) {
                    for (const key in parameters) {
                        if (Object.prototype.hasOwnProperty.call(parameters, key)) {
                            const e = parameters[key];
                            vm[key] = e;
                        }
                    }
                    (control as any).init?.()
                        ?.catch((error) => {
                            if (!CancelToken.isCancelled(error)) {
                                console.error(error);
                            }
                        });
                }
                cancelToken?.registerForCancel(cancel);
                isModal = modal;
            }

            const host = findHost(opener);
            host.appendChild(control.element);

            vm.cancel = cancel;
            vm.close = close;
            if (vm !== control) {
                control.cancel = cancel;
                control.close = close;
            }

            if (isModal) {
                const bg = document.createElement("div");
                bg.style.position = "absolute";
                bg.style.right = "0";
                bg.style.bottom = "0";
                bg.style.left = "0";
                bg.style.top = "0";
                host.appendChild(bg);

                const onBack = (e: CustomEvent) => {
                    e.preventDefault();
                    e.stopImmediatePropagation?.();
                    e.stopPropagation();
                    (control as any).requestCancel?.();
                };

                window.addEventListener("backButton", onBack, true);

                control.registerDisposable({
                    dispose: () => {
                        bg.remove();
                        window.removeEventListener("backButton", onBack, true);
                    }
                });
            } else {
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
        popup: HTMLElement | XNode,
        options?: IPopupOptions): IPopup {
        const previousTarget = opener;
        const container: IPopup = {
            element: document.createElement("div"),
            disposables: new AtomDisposableList(),
            registerDisposable: null,
            dispose: null,
        };
        container.registerDisposable = (f) => container.disposables.add(f);

        let alignment = options?.alignment ?? "auto";

        if (alignment === "auto") {
            const rect = opener.getBoundingClientRect();
            const w = window.visualViewport.width;
            if (rect.left > w / 2) {
                alignment = "bottomRight";
            }
        }

        const isCenterOfScreen = alignment === "centerOfScreen";
        const popupStyle = options?.popupStyle ?? popupCss;
        container.element._logicalParent = opener;
        container.element.classList.add(popupStyle);
        if (isCenterOfScreen) {
            container.element.dataset.centerPopup = "center";
        } else {
            container.element.dataset.inlinePopup = "left";
            const alignPopup = () => {
                switch(alignment) {
                    case "bottomRight":
                        container.element.style.top = (opener.offsetTop + opener.offsetHeight) + "px";
                        container.element.style.right = "0px";
                        container.element.dataset.inlinePopup = "right";
                        opener.insertAdjacentElement("afterend", container.element);
                        break;
                    case "topRight":
                    case "right":
                        container.element.style.top = (opener.offsetTop) + "px";
                        container.element.style.left = (opener.offsetWidth) + "px";
                        opener.insertAdjacentElement("afterend", container.element);
                        break;
                    case "bottomLeft":
                        container.element.dataset.inlinePopup = "inline-left";
                        container.element.style.top = (opener.offsetTop + opener.offsetHeight) + "px";
                        opener.insertAdjacentElement("beforebegin", container.element);
                        break;
                    default:
                        container.element.style.top = (opener.offsetTop + opener.offsetHeight) + "px";
                        opener.insertAdjacentElement("afterend", container.element);
                        break;
                }
            };
            if (opener.offsetParent !== opener.parentElement) {
                opener.parentElement.style.position = "relative";
                setTimeout(alignPopup, 5);
            } else {
                alignPopup();
            }
        }
        const parent = AtomControl.from(opener);

        if (popup instanceof XNode) {
            // @ts-ignore
            parent.render(popup, container);
        } else {
            container.element.appendChild(popup);
        }
        const style = container.element.style;
        // const offset = findHostAndPosition(opener);
        // const host = offset.root;
        // const hostHeight = host.offsetHeight
        // || host.clientHeight
        // || (host.firstElementChild as HTMLElement).offsetHeight;

        // style.position = "absolute";
        // offset.y += opener.offsetHeight;

        // if (options?.alignment === "centerOfScreen") {
        //     style.left = "50%";
        //     style.top = "50%";
        //     style.transform = "translate(-50%,-50%)";
        // } else {

        //     if (!options || options?.alignment === "auto") {

        //         // check where is more space??
        //         if (offset.x < (host.offsetWidth / 2)) {
        //             style.left = offset.x + "px";
        //         } else {
        //             style.right = `${(host.offsetWidth - (offset.x + opener.offsetWidth))}px`;
        //         }

        //         if (offset.y < (hostHeight / 2)) {
        //             style.top = offset.y + "px";
        //         } else {
        //             style.top = `${offset.y - opener.offsetHeight}px`;
        //             style.transform = "translate(0, -100%)";
        //         }

        //     } else {
        //         offset.y -= opener.offsetHeight;
        //         style.top = offset.y + "px";
        //         if (options?.alignment === "right") {
        //             style.left = `${(opener.offsetLeft + opener.offsetWidth)}px`;
        //         } else {
        //             style.left = offset.x + "px";
        //         }
        //     }
        // }
        style.zIndex = `${popupId++}`;

        // host.appendChild(container.element);
        container.dispose = () => {
            if (!container.disposables) {
                return;
            }
            container.disposables.dispose();
            parent.dispose(container.element);
            container.element.remove();
            container.disposables = null;
            PopupService.lastTarget = previousTarget;
        };

        closeHandler(opener.parentElement, opener, container, () => {
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
