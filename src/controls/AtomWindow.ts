import { AtomDevice } from "../core/AtomDevice";
import { bindableProperty } from "../core/bindable-properties";
import { IClassOf } from "../core/types";
import { RegisterSingleton } from "../di/RegisterSingleton";
import { ServiceProvider } from "../di/ServiceProvider";
import { AtomControl, IAtomControlElement } from "./AtomControl";
import { AtomTemplate } from "./AtomTemplate";

@RegisterSingleton
export class AtomWindowStyle {
    
    public windowTemplate;

    constructor() {

    }
}

export class AtomWindowFrameTemplate extends AtomTemplate {

    public commandPresenter: HTMLElement;

    protected create(): void {

        const style = this.resolve(AtomWindowStyle);

        this.element = document.createElement("div");
        this.element.classList.add("window-template");
        this.element.style.alignSelf = "center";

        // add title host

        const titleHost = document.createElement("div");
        titleHost.classList.add("title-host");

        // add title

        const title = document.createElement("span");
        title.classList.add("title");
        title.style.alignSelf = "left";

        // add close button
        const closeButton = document.createElement("button");
        closeButton.classList.add("close-button");
        closeButton.style.alignSelf = "right";
        this.bindEvent(closeButton, "click", (e) => {
            const w = this.templateParent as AtomWindow;
            w.close();
        });

        // append title host > title

        titleHost.appendChild(title);
        titleHost.appendChild(closeButton);
        this.element.appendChild(titleHost);

        // add content presneter
        const cp = document.createElement("div");
        cp.classList.add("content-presenter");
        this.contentPresenter = cp;
        this.element.appendChild(cp);

        // create command presenter
        const cdp = document.createElement("div");
        cdp.classList.add("command-presenter");
        this.commandPresenter = cdp;
        this.element.appendChild(cdp);

        this.init();

    }

}

export class AtomWindow extends AtomControl {

    @bindableProperty
    public title: string = "";

    @bindableProperty
    public windowTemplate: IClassOf<AtomControl>;

    @bindableProperty
    public commandTemplate: IClassOf<AtomControl>;

    @bindableProperty
    public frameTemplate: IClassOf<AtomWindowFrameTemplate> = AtomWindowFrameTemplate;

    constructor(e?: HTMLElement) {
        super(e);
        this.element.classList.add("atom-window");
    }

    public onPropertyChanged(name: string): void {
        switch (name) {
            case "windowTemplate":
            case "commandTemplate":
            case "frameTemplate":
                this.runAfterInit(() => {
                    this.createWindow();
                });
                break;
        }
    }

    public close(): void {
        const message = `atom-window-cancel:${this.element.id}`;
        const device = ServiceProvider.global.get(AtomDevice);
        device.broadcast(message, "canceled");
    }

    private createWindow(): void {
        if (!(this.windowTemplate && this.frameTemplate)) {
            return;
        }

        // let us create frame first...
        const frame = new (this.frameTemplate)();
        const fe = frame.element as IAtomControlElement;

        fe._logicalParent = this.element as IAtomControlElement;
        fe._templateParent = this;

        if (!frame.contentPresenter) {
            throw new Error("ContentPresenter must be set inside frameTemplate before creating window");
        }

        const content = new (this.windowTemplate)();
        frame.contentPresenter.appendChild(content.element);

        if (this.commandTemplate) {
            if (!frame.commandPresenter) {
                throw new Error("CommandPresenter must be set inside frameTemplate" +
                    "before creating window if command template is present");
            }
            const command = new (this.commandTemplate)();
            frame.commandPresenter.appendChild(command.element);
        }

        this.append(frame);
    }

}
