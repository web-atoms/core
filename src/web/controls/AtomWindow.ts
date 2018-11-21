import { App } from "../../App";
import { BindableProperty } from "../../core/BindableProperty";
import { IClassOf, IDisposable, IRect } from "../../core/types";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import { AtomUI } from "../../web/core/AtomUI";
import { AtomTheme } from "../styles/AtomTheme";
import { AtomWindowStyle } from "../styles/AtomWindowStyle";
import { AtomControl, IAtomControlElement } from "./AtomControl";
import { AtomTemplate } from "./AtomTemplate";
export class AtomWindowFrameTemplate extends AtomTemplate {

    public commandPresenter: HTMLElement;

    public titlePresenter: HTMLElement;

    protected create(): void {

        this.element = document.createElement("div");

        // remember, if you do not wish to use dynamic themes
        // then use one time binding
        this.bind(this.element, "styleClass", [["templateParent", "controlStyle", "frame"]]);
        this.bind(this.element, "styleWidth", [["templateParent", "width"]]);
        this.bind(this.element, "styleHeight", [["templateParent", "height"]]);
        this.bind(this.element, "styleLeft", [["templateParent", "x"]], false, (v) => v ? v + "px" : undefined);
        this.bind(this.element, "styleTop", [["templateParent", "y"]], false, (v) => v ? v + "px" : undefined);
        this.bind(this.element, "styleMarginTop", [["templateParent", "x"]], false, (v) => v >= 0 ? "0" : undefined);
        this.bind(this.element, "styleMarginLeft", [["templateParent", "x"]], false, (v) => v >= 0 ? "0" : undefined);
        this.bind(this.element, "styleMarginRight", [["templateParent", "x"]], false, (v) => v >= 0 ? "0" : undefined);
        this.bind(this.element, "styleMarginBottom", [["templateParent", "x"]], false, (v) => v >= 0 ? "0" : undefined);
        // add title host
        const titlePresenter = document.createElement("div");
        this.bind(titlePresenter, "styleClass", [["templateParent", "controlStyle", "titlePresenter"]]);
        // titleHost.classList.add(style.titleHost.className);
        this.titlePresenter = titlePresenter;
        this.element.appendChild(titlePresenter);

        // add content presneter
        const cp = document.createElement("div");
        this.bind(cp, "styleClass", [["templateParent", "controlStyle", "content"]]);
        // cp.classList.add(style.content.className);
        this.contentPresenter = cp;
        this.element.appendChild(cp);

        // create command presenter
        const cdp = document.createElement("div");
        // cdp.classList.add(style.commandBar.className);
        this.bind(cdp, "styleClass", [["templateParent", "controlStyle", "commandBar"]]);
        this.commandPresenter = cdp;
        this.element.appendChild(cdp);

    }

}

class AtomWindowTitleTemplate extends AtomControl {
    protected create(): void {

        this.element = document.createElement("div");
        this.bind(this.element, "styleClass", [["templateParent", "controlStyle", "titleHost"]]);

        // add title

        const title = document.createElement("span");
        this.bind(title, "styleClass", [["templateParent", "controlStyle", "title"]]);
        // title.classList.add(style.title.className);
        this.bind(title, "text", [["templateParent", "title"]], false);

        // add close button
        const closeButton = document.createElement("button");
        this.bind(closeButton, "styleClass", [["templateParent", "controlStyle", "closeButton"]]);
        // closeButton.textContent = "x";

        this.bindEvent(closeButton, "click", (e) => {
            const w = this.templateParent as AtomWindow;
            w.close();
        });

        // append title host > title

        this.append(title);
        this.append(closeButton);
    }
}

export class AtomWindow extends AtomControl {

    @BindableProperty
    public title: string = "";

    @BindableProperty
    public width: string = "300px";

    @BindableProperty
    public height: string = "200px";

    @BindableProperty
    public x: number = -1;

    @BindableProperty
    public y: number = -1;

    @BindableProperty
    public windowTemplate: IClassOf<AtomControl>;

    @BindableProperty
    public commandTemplate: IClassOf<AtomControl>;

    @BindableProperty
    public titleTemplate: IClassOf<AtomControl> = AtomWindowTitleTemplate;

    @BindableProperty
    public frameTemplate: IClassOf<AtomWindowFrameTemplate> = AtomWindowFrameTemplate;

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

        const message = `atom-window-cancel:${this.element.id}`;
        const device = this.app.resolve(App);
        device.broadcast(message, "cancelled");
    }

    public onUpdateUI(): void {
        if (!(this.windowTemplate && this.frameTemplate)) {
            return;
        }

        this.bind(this.element, "title", [["viewModel", "title"]]);

        // let us create frame first...
        const frame = new (this.frameTemplate)(this.app);
        const fe = frame.element as IAtomControlElement;

        // setup drag and drop for the frame...
        const titleContent = new (this.titleTemplate)(this.app);
        (titleContent.element as IAtomControlElement)._templateParent = this;
        frame.titlePresenter.appendChild(titleContent.element);

        this.setupDragging(frame.titlePresenter);

        this.element.classList.add(this.controlStyle.frameHost.className);

        fe._logicalParent = this.element as IAtomControlElement;
        fe._templateParent = this;

        if (!frame.contentPresenter) {
            throw new Error("ContentPresenter must be set inside frameTemplate before creating window");
        }

        const content = new (this.windowTemplate)(this.app);
        (content.element as IAtomControlElement)._templateParent = this;
        frame.contentPresenter.appendChild(content.element);

        if (this.commandTemplate) {
            if (!frame.commandPresenter) {
                throw new Error("CommandPresenter must be set inside frameTemplate" +
                    "before creating window if command template is present");
            }
            const command = new (this.commandTemplate)(this.app);
            (command.element as IAtomControlElement)._templateParent = this;
            frame.commandPresenter.appendChild(command.element);
        }
        this.append(frame);
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
