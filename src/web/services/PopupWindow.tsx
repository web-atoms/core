import Bind from "../../core/Bind";
import { BindableProperty } from "../../core/BindableProperty";
import XNode from "../../core/XNode";
import sleep from "../../core/sleep";
import { CancelToken, IClassOf, IDisposable, IRect } from "../../core/types";
import styled from "../../style/styled";
import { AtomControl } from "../controls/AtomControl";
import { ChildEnumerator } from "../core/AtomUI";
import type PopupService from "./PopupService";
import type { IDialogOptions } from "./PopupService";

let popupService: typeof PopupService;

const loadPopupService = async () => {
    if (popupService) {
        return popupService;
    }
    return popupService = (await (import("./PopupService"))).default;
};

const focus = (popup: PopupWindow) => {
    const element = popup.element;
    if (!element) {
        return;
    }
    const host = element.querySelector(`[data-window-element="title"]`)
        ?? element.querySelector(`[data-window-element="action-bar"]`);
    if(host) {
        // @ts-expect-error
        popup.setupDragging(host as HTMLElement);
    }
    // this.element may become null if it was immediately
    // closed, very rare case, but possible if
    // supplied cancelToken was cancelled
    const anyAutofocus = element.querySelector(`*[autofocus]`);
    if (!anyAutofocus) {
        // const windowContent = element.querySelector("[data-window-content]");
        // if (windowContent) {
        //     const firstInput = windowContent.querySelector("input,button,a") as HTMLInputElement;
        //     if (firstInput) {
        //         firstInput.focus();
        //         return;
        //     }
        // }

        const cb = element.querySelector(".popup-close-button") as HTMLButtonElement;
        if (cb) {
            cb.focus();
        }
        return;
    }
    (anyAutofocus as HTMLElement).focus?.();
};

    styled.css `
        position: absolute;
        border: solid 1px lightgray;
        border-radius: 5px;
        background-color: canvas;
        color: canvastext;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 20px 1px rgba(0 0 0 / 75%);

        display: grid;
        align-items: stretch;
        justify-items: stretch;
        grid-template-rows: auto auto 1fr auto;
        grid-template-columns: auto 1fr auto;
        opacity: 0;
        transition: opacity 0.3s cubic-bezier(0.55, 0.09, 0.97, 0.32) ;
        overflow: hidden;

        [data-window-modal-background=background] {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
        }

        &[data-no-width=true] {
            max-width: 95%;
            min-width: 300px;
        }
        &[data-no-height=true] {
            max-height: 95%;
            min-height: 100px;
        }

        &[data-maximize=true] {
            width: 90%;
            height: 90%;
        }

        &[data-ready=true] {
            opacity: 1;
        }
        &[data-dragging=true] {
            opacity: 0.5;
        }
        & > [data-window-element=icon] {
            grid-row: 1;
            grid-column: 1;
            z-index: 2;
        }
        & > [data-window-element=title] {
            grid-row: 1;
            grid-column: 2;
            font-size: medium;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            cursor: move;
            padding: var(--spacing, 5px);
            color: var(--accent-text-color, #424242);
            z-index: 2;
        }
        & > [data-window-element=close] {
            grid-row: 1;
            grid-column: 3;
            color: white;
            background-color: red;
            border-radius: 9999px;
            border: none;
            outline: none;
            /* padding: 5px; */
            font-family: monospace;
            height: 20px;
            width: 20px;
            margin: 5px;
            cursor: pointer;
            text-transform: capitalize;
            z-index: 2;
        }
        & > [data-window-element=action-bar] {
            grid-row: 1;
            grid-column: 1 / span 3;
            align-self: stretch;
            justify-self: stretch;
            background-color: var(--accent-color, rgba(211, 211, 211, 0.2));
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            z-index: 1;
        }
        & > [data-window-element=header] {
            margin-top: 5px;
            grid-row: 2;
            grid-column: 1 / span 3;
        }
        & > [data-window-element=content] {
            margin-top: 5px;
            grid-row: 3;
            grid-column: 1 / span 3;
            position: relative;
            overflow: auto;
            padding: var(--spacing-medium, 7px);
            &[data-maximize=true] {
                width: 90vw;
                height: 90vh;
            }
        }
        & > [data-window-element=footer] {
            margin-top: 5px;
            grid-row: 4;
            grid-column: 1 / span 3;
            padding-top: 5px;
            padding-bottom: 5px;
            background-color: var(--command-bar-color, #80808025);

            & > button, & > * > button {
                border-radius: 9999px;
                padding: 5px;
                padding-left: 20px;
                padding-right: 20px;
                border-width: 1px;
                border-color: transparent;
                margin: 5px;
                margin-left: 10px;
            }            
        }

    `.installGlobal("[data-popup-window=popup-window]")

export default class PopupWindow extends AtomControl {

    public static async showWindow<T>(options?: IDialogOptions): Promise<T>;
    public static async showWindow<T>(window: IClassOf<PopupWindow>, options?: IDialogOptions): Promise<T>;
    public static async showWindow<T>(
        window: IClassOf<PopupWindow> | IDialogOptions,
        options?: IDialogOptions): Promise<T> {
        if (arguments.length <= 1) {
            options = arguments[0];
            window = this;
        }
        // this will force lastTarget to be set
        await sleep(1);
        const PS = await loadPopupService();
        return PS.showWindow<T>(PS.lastTarget, window as any, options);
    }

    public static async showModal<T>(options?: IDialogOptions): Promise<T>;
    public static async showModal<T>(window: IClassOf<PopupWindow>, options?: IDialogOptions): Promise<T>;
    public static async showModal<T>(
        window: IClassOf<PopupWindow> | IDialogOptions,
        options?: IDialogOptions): Promise<T> {
        if (arguments.length <= 1) {
            options = arguments[0];
            window = this;
        }
        options ??= {};
        options.modal ??= true;
        // this will force lastTarget to be set
        await sleep(1);
        const PS = await loadPopupService();
        return PS.showWindow<T>(PS.lastTarget, window as any, options);
    }


    @BindableProperty
    public title?: string;

    public viewModelTitle?: string;

    public close: (r?) => void;

    public cancel: (r?) => void;

    @BindableProperty
    public titleRenderer: () => XNode;

    @BindableProperty
    public closeButtonRenderer: () => XNode;

    @BindableProperty
    public footerRenderer: () => XNode;

    @BindableProperty
    public headerRenderer: () => XNode;

    @BindableProperty
    public iconRenderer: () => XNode;

    @BindableProperty
    public actionBarRenderer: () => XNode;

    @BindableProperty
    public closeWarning: string;

    protected readonly cancelToken: CancelToken;

    private initialized = false;

    public onPropertyChanged(name) {
        super.onPropertyChanged(name);
        switch (name as keyof PopupWindow) {
            case "iconRenderer":
                this.recreate(name, "icon");
                break;
            case "actionBarRenderer":
                this.recreate(name, "action-bar");
                break;
            case "footerRenderer":
                this.recreate(name, "footer");
                break;
            case "titleRenderer":
                this.recreate(name, "title");
                break;
            case "headerRenderer":
                this.recreate(name, "header");
                break;
            case "closeButtonRenderer":
                this.recreate(name, "close");
                break;
            }
    }

    protected init(): any {
        // do nothing...
    }

    protected async requestCancel() {
        if (this.closeWarning) {
            if (!await ConfirmPopup.confirm({
                message : this.closeWarning
            })) {
                return;
            }
        }
        this.cancel();
    }

    protected recreate(renderer, name): HTMLElement {
        const node = this[renderer]?.() ?? undefined;
        for (const e of ChildEnumerator.enumerate(this.element)) {
            if (e.getAttribute("data-window-element") === name) {
                this.dispose(e);
                e.remove();
                break;
            }
        }
        if (node) {
            const na = node.attributes ??= {};
            na["data-window-element"] = name;
            super.render(<div>{node}</div>);
            return this.element.querySelector(`[data-window-element="${name}"]`);
        }
        return null;
    }

    /**
     * This is because if someone changes renderer, entire content will
     * vanish, so we need to update allow update of only content element
     * @returns 
     */
        protected rendererChanged() {
            for (const content of ChildEnumerator.where(this.element,
                (e) => e.getAttribute("data-window-element") === "content")) {
                this.dispose(content);
                content.remove();
            }
            const r = this.renderer;
            if (!r) {
                return;
            }
            delete this.render;
            this.render(r);
        }
    

    protected preCreate(): void {
        this.title = null;
        this.viewModelTitle = null;
        const c = new CancelToken();
        // @ts-expect-error
        this.cancelToken = c;
        this.registerDisposable({
            dispose() {
                c.cancel();
            }
        });
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                this.app.runAsync(() => this.requestCancel());
                e.preventDefault();
                return;
            }
        };
        this.bindEvent(this.element, "keydown", handler);
        // document.body.addEventListener("keydown", handler);
        // this.registerDisposable({
        //     dispose() {
        //         document.body.removeEventListener("keydown", handler);
        //     }
        // });
        this.element.setAttribute("data-popup-window", "popup-window");

        // init will be called if parameters are set...
        // this.runAfterInit(() => this.app.runAsync(() => this.init?.()));

        setTimeout((p: HTMLElement) => {
            p.setAttribute("data-ready", "true");
        }, 10, this.element);
    }

    protected render(node: XNode, e?: any, creator?: any): void {

        // this is because nested render will call `this.` instead of `super.`
        if (e || node?.attributes?.["data-window-element"]) {
            super.render(node, e, creator);
            return;
        }

        this.render = super.render;

        this.titleRenderer ??= () => <div
            class="title-text" text={Bind.oneWay(() => this.title || this.viewModelTitle)}/>;
        this.closeButtonRenderer ??= () => <button
            class="popup-close-button"
            text="x"
            eventClick={Bind.event(() => this.requestCancel())}/>;
        this.actionBarRenderer ??= () => <div/>;
        const a = node.attributes ??= {};
        a["data-window-content"] = "window-content";
        a["data-window-element"] = "content";
        const extracted = this.extractControlProperties(node);

        super.render(<div
            viewModelTitle={Bind.oneWay(() => this.viewModel.title)}
            { ... extracted }>
            { node }
        </div>, e, creator);

        if(!this.initialized) {
            this.initialized = true;
            this.runAfterInit(() => {
                setTimeout(focus, 100, this);
            });
        }
    }

    protected setupDragging(tp: HTMLElement): void {
        this.bindEvent(tp, "mousedown", (startEvent: MouseEvent) => {
            if ((startEvent.target as HTMLElement).tagName === "BUTTON") {
                return;
            }
            startEvent.preventDefault();
            const disposables: IDisposable[] = [];
            // const offset = AtomUI.screenOffset(tp);
            const element = this.element;
            const offset = { x: element.offsetLeft, y: element.offsetTop };
            if (element.style.transform !== "none") {
                offset.x -= element.offsetWidth / 2;
                offset.y -= element.offsetHeight / 2;
                element.style.left = offset.x + "px";
                element.style.top = offset.y + "px";
                element.style.transform = "none";
            }
            this.element.dataset.dragging = "true";
            const rect: IRect = { x: startEvent.clientX, y: startEvent.clientY };
            const cursor = tp.style.cursor;
            tp.style.cursor = "move";
            disposables.push(this.bindEvent(document.body, "mousemove", (moveEvent: MouseEvent) => {
                const { clientX, clientY } = moveEvent;
                const dx = clientX - rect.x;
                const dy = clientY - rect.y;

                const finalX = offset.x + dx;
                const finalY = offset.y + dy;
                if (finalX < 5 || finalY < 5) {
                    return;
                }

                offset.x = finalX;
                offset.y = finalY;

                this.element.style.left = offset.x + "px";
                this.element.style.top = offset.y + "px";

                rect.x = clientX;
                rect.y = clientY;
            }));
            disposables.push(this.bindEvent(document.body, "mouseup", (endEvent: MouseEvent) => {
                tp.style.cursor = cursor;
                this.element.removeAttribute("data-dragging");
                for (const iterator of disposables) {
                    iterator.dispose();
                }
            }));
        });
    }


}

// @ts-ignore
delete PopupWindow.prototype.init;

    styled.css `
        & >[data-window-element=content] > [data-element=details] {
            margin-top: 5px;
            overflow: auto;
            max-width: 80vw;
            max-height: 50vh;
        }
        & > [data-window-element=footer] {

            & > .yes {
                background-color: #01af01;
                color: white;
            }
            & > .no {
                background-color: red;
                color: white;
            }
            & > .cancel {
                background-color: gray;
                color: white;
            }
        }
    `.installGlobal("[data-confirm-popup=confirm-popup]")

export class ConfirmPopup extends PopupWindow {

    public static async confirm({
        message,
        title = "Confirm",
        yesLabel = "Yes",
        noLabel = "No",
        cancelLabel = null
    }): Promise<boolean> {
        const PS = await loadPopupService();
        return PS.confirm({ title, message, yesLabel, noLabel,  cancelLabel});
    }

    public message: string;

    public messageRenderer: () => XNode;

    public yesLabel: string;

    public noLabel: string;

    public cancelLabel: string;

    protected preCreate(): void {
        super.preCreate();
        this.yesLabel = "Yes";
        this.noLabel = "No";
        this.cancelLabel = null;

        this.element.setAttribute("data-confirm-popup", "confirm-popup");

        this.footerRenderer = () => <div>
            <button
                class="yes"
                autofocus={true}
                text={Bind.oneWay(() => this.yesLabel)}
                eventClick={() => this.close(true)}
                style-display={Bind.oneWay(() => !!this.yesLabel)}
                />
            <button
                class="no"
                text={Bind.oneWay(() => this.noLabel)}
                eventClick={() => this.close(false)}
                style-display={Bind.oneWay(() => !!this.noLabel)}
                />
            <button
                class="cancel"
                text={Bind.oneWay(() => this.cancelLabel)}
                eventClick={() => this.requestCancel()}
                style-display={Bind.oneWay(() => !!this.cancelLabel)}
                />
        </div>;

        this.closeButtonRenderer = () => <div style-display="none"/>;
    }

    protected requestCancel(): Promise<void> {
        this.cancel();
        return Promise.resolve();
    }

    // protected render(node: XNode, e?: any, creator?: any) {
    //     this.render = super.render;
    //     this.element.dataset.confirmPopup = "confirm-popup";
    //     this.closeButtonRenderer = () => <div/>;
    //     const extracted = this.extractControlProperties(node);
    //     const na = node.attributes ??= {};
    //     na["data-element"] = "message";
    //     super.render(<div { ... extracted }>
    //         { node }
    //         <div data-element="buttons">
    //             <button
    //                 class="yes"
    //                 autofocus={true}
    //                 text={Bind.oneWay(() => this.yesLabel)}
    //                 eventClick={() => this.close(true)}
    //                 style-display={Bind.oneWay(() => !!this.yesLabel)}
    //                 />
    //             <button
    //                 class="no"
    //                 text={Bind.oneWay(() => this.noLabel)}
    //                 eventClick={() => this.close(false)}
    //                 style-display={Bind.oneWay(() => !!this.noLabel)}
    //                 />
    //             <button
    //                 class="cancel"
    //                 text={Bind.oneWay(() => this.cancelLabel)}
    //                 eventClick={() => this.requestCancel()}
    //                 style-display={Bind.oneWay(() => !!this.cancelLabel)}
    //                 />
    //         </div>
    //     </div>);
    // }

}