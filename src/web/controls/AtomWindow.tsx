import { App } from "../../App";
import Bind from "../../core/Bind";
import { BindableProperty } from "../../core/BindableProperty";
import { IClassOf, IDisposable, IRect } from "../../core/types";
import XNode from "../../core/XNode";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import { AtomUI } from "../core/AtomUI";
import { AtomTheme } from "../styles/AtomTheme";
import { AtomWindowStyle } from "../styles/AtomWindowStyle";
import { AtomControl } from "./AtomControl";
import { AtomTemplate } from "./AtomTemplate";

export function getTemplateParent(e: HTMLElement) {
    const tp = e._templateParent;
    if (tp) {
        return tp;
    }
    const p = e._logicalParent || e.parentElement;
    if (p) {
        return getTemplateParent(p);
    }
}

export class AtomWindowFrameTemplate extends AtomTemplate {

    public get templateParent(): AtomWindow {
        return getTemplateParent(this.element);
    }

    public commandPresenter: HTMLElement;

    public titlePresenter: HTMLElement;

    protected preCreate() {
        this.titlePresenter = null;
        this.commandPresenter = null;
        this.contentPresenter = null;
        super.preCreate();
    }

    protected create(): void {

        // remember, if you do not wish to use dynamic themes
        // then use one time binding
        this.render(<div
            class="frame"
            styleWidth={Bind.oneWay(() => this.templateParent.width || undefined)}
            styleHeight={Bind.oneWay(() => this.templateParent.height || undefined)}
            styleLeft={Bind.oneWay(() => this.templateParent.x >= 0 ? `${this.templateParent.x}px` : undefined)}
            styleTop={Bind.oneWay(() => this.templateParent.y >= 0 ? `${this.templateParent.y}px` : undefined)}
            styleMarginTop={Bind.oneWay(() => this.templateParent.x >= 0 ? "0" : undefined)}
            styleMarginLeft={Bind.oneWay(() => this.templateParent.x >= 0 ? "0" : undefined)}
            styleMarginRight={Bind.oneWay(() => this.templateParent.x >= 0 ? "0" : undefined)}
            styleMarginBottom={Bind.oneWay(() => this.templateParent.x >= 0 ? "0" : undefined)}>
            <div
                class="title-presenter"
                presenter={Bind.presenter("titlePresenter")}/>
            <div
                class="content-presenter"
                presenter={Bind.presenter("contentPresenter")}/>
            <div
                class="command-bar"
                presenter={Bind.presenter("commandPresenter")}/>
        </div>);
        // this.bind(this.element, "styleClass", [["templateParent", "controlStyle", "frame"]]);
        // this.bind(this.element, "styleWidth", [["templateParent", "width"]], false, (v) => v || undefined);
        // this.bind(this.element, "styleHeight", [["templateParent", "height"]], false, (v) => v || undefined);
        // this.bind(this.element, "styleLeft", [["templateParent", "x"]],
        //     false, (v) => v >= 0 ? v + "px" : undefined);
        // this.bind(this.element, "styleTop", [["templateParent", "y"]],
        //     false, (v) => v >= 0 ? v + "px" : undefined);
        // this.bind(this.element, "styleMarginTop", [["templateParent", "x"]], false, (v) => v >= 0 ? "0" : undefined);
        // this.bind(this.element, "styleMarginLeft", [["templateParent", "x"]],
        //  false, (v) => v >= 0 ? "0" : undefined);
        // this.bind(this.element, "styleMarginRight", [["templateParent", "x"]],
        // false, (v) => v >= 0 ? "0" : undefined);
        // this.bind(this.element, "styleMarginBottom", [["templateParent", "x"]],
        // false, (v) => v >= 0 ? "0" : undefined);
        // // add title host
        // const titlePresenter = document.createElement("div");
        // this.bind(titlePresenter, "styleClass", [["templateParent", "controlStyle", "titlePresenter"]]);
        // // titleHost.classList.add(style.titleHost.className);
        // this.titlePresenter = titlePresenter;
        // this.element.appendChild(titlePresenter);

        // // add content presenter
        // const cp = document.createElement("div");
        // this.bind(cp, "styleClass", [["templateParent", "controlStyle", "content"]]);
        // // cp.classList.add(style.content.className);
        // this.contentPresenter = cp;
        // this.element.appendChild(cp);

        // // create command presenter
        // const cdp = document.createElement("div");
        // // cdp.classList.add(style.commandBar.className);
        // this.bind(cdp, "styleClass", [["templateParent", "controlStyle", "commandBar"]]);
        // this.commandPresenter = cdp;
        // this.element.appendChild(cdp);

    }

}

class AtomWindowTitleTemplate extends AtomControl {

    public get templateParent(): AtomWindow {
        return getTemplateParent(this.element);
    }

    protected create(): void {

        this.render(<div
            class="title-host">
            <span
                class="title"
                text={Bind.oneWay(() => this.templateParent.title)}
                />
            <button
                class="close-button"
                eventClick={Bind.event(() => this.templateParent.close())}
                />
        </div>);

        // this.bind(this.element, "styleClass", [["templateParent", "controlStyle", "titleHost"]]);

        // // add title

        // const title = document.createElement("span");
        // this.bind(title, "styleClass", [["templateParent", "controlStyle", "title"]]);
        // // title.classList.add(style.title.className);
        // this.bind(title, "text", [["templateParent", "title"]], false);

        // // add close button
        // const closeButton = document.createElement("button");
        // this.bind(closeButton, "styleClass", [["templateParent", "controlStyle", "closeButton"]]);
        // // closeButton.textContent = "x";

        // this.bindEvent(closeButton, "click", (e) => {
        //     const w = getTemplateParent(this.element) as AtomWindow;
        //     w.close();
        // });

        // // append title host > title

        // this.append(title);
        // this.append(closeButton);
    }
}

export class AtomWindow extends AtomControl {

    public static windowTemplate = XNode.prepare("windowTemplate", true, true);

    public static commandTemplate = XNode.prepare("commandTemplate", true, true);

    public static titleTemplate = XNode.prepare("titleTemplate", true, true);

    public static frameTemplate = XNode.prepare("frameTemplate", true, true);

    public get templateParent() {
        return getTemplateParent(this.element);
    }

    public title: string = "";

    public width: string = "";

    public height: string = "";

    public x: number = -1;

    public y: number = -1;

    public windowTemplate: IClassOf<AtomControl>;

    public commandTemplate: IClassOf<AtomControl>;

    public titleTemplate: IClassOf<AtomControl> = AtomWindowTitleTemplate;

    public frameTemplate: IClassOf<AtomWindowFrameTemplate> = AtomWindowFrameTemplate;

    private isReady: boolean = false;

    public onPropertyChanged(name: string): void {
        switch (name) {
            case "windowTemplate":
            case "commandTemplate":
            case "frameTemplate":
                this.invalidate();
                break;
        }
    }

    public close(): void {

        const vm = this.viewModel as AtomWindowViewModel;
        if (vm.cancel) {
            this.app.runAsync(() => vm.cancel());
            return;
        }

        const message = `atom-window-cancel:${(this as any).id}`;
        const device = this.app.resolve(App);
        device.broadcast(message, "cancelled");
    }

    public onUpdateUI(): void {
        if (!(this.windowTemplate && this.frameTemplate)) {
            return;
        }

        if (this.isReady) {
            return;
        }

        this.bind(this.element, "title", [["viewModel", "title"]]);

        // let us create frame first...
        const frame = new (this.frameTemplate)(this.app);
        const fe = frame.element;

        // setup drag and drop for the frame...
        const titleContent = new (this.titleTemplate)(this.app);
        (titleContent.element)._templateParent = this;
        frame.titlePresenter.appendChild(titleContent.element);

        this.setupDragging(frame.titlePresenter);

        this.element.classList.add("frame-host");

        fe._logicalParent = this.element;
        fe._templateParent = this;

        if (!frame.contentPresenter) {
            throw new Error("ContentPresenter must be set inside frameTemplate before creating window");
        }

        const content = new (this.windowTemplate)(this.app);
        (content.element)._templateParent = this;
        this.setElementClass(content.element, { content: 1 });
        frame.contentPresenter.appendChild(content.element);

        if (this.commandTemplate) {
            if (!frame.commandPresenter) {
                throw new Error("CommandPresenter must be set inside frameTemplate" +
                    "before creating window if command template is present");
            }
            const command = new (this.commandTemplate)(this.app);
            (command.element)._templateParent = this;
            frame.commandPresenter.appendChild(command.element);
        }
        this.append(frame);

        // lets center frame...
        setTimeout(() => {
            this.centerFrame(frame.element);
        }, 100);
        this.isReady = true;
    }

    protected preCreate() {
        this.defaultControlStyle = AtomWindowStyle;
        this.title = null;
        this.width = "";
        this.height = "";
        this.x = -1;
        this.y = -1;
        this.windowTemplate = null;
        this.commandTemplate = null;
        this.titleTemplate = AtomWindowTitleTemplate;
        this.frameTemplate = AtomWindowFrameTemplate;
        super.preCreate();
        this.render(<div
            styleClass={Bind.oneTime(() => this.controlStyle.name)}
            ></div>);
    }

    private centerFrame(e: HTMLElement): void {
        /// window is destroyed probably..
        if (!this.element) {
            return;
        }
        const parent = this.element.parentElement;
        if (parent as any === window || parent as any === document.body) {
            return;
        }
        if (parent.offsetWidth <= 0 || parent.offsetHeight <= 0) {
            setTimeout(() => {
                this.centerFrame(e);
            }, 100);
            return;
        }

        if (e.offsetWidth <= 0 || e.offsetHeight <= 0) {
            setTimeout(() => {
                this.centerFrame(e);
            }, 100);
            return;
        }

        const x = (parent.offsetWidth - e.offsetWidth) / 2;
        const y = (parent.offsetHeight - e.offsetHeight) / 2;
        this.x = x;
        this.y = y;
        e.style.opacity = "1";
        this.element.style.removeProperty("opacity");
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

                this.x = offset.x;
                this.y = offset.y;

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
