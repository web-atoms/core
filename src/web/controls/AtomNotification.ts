import { BindableProperty } from "../../core/BindableProperty";
import { AtomControl } from "./AtomControl";
import { AtomWindow } from "./AtomWindow";

export default class AtomNotification extends AtomWindow {

    @BindableProperty
    public timeout: number = 3000;

    private timeoutKey: any = null;

    public onPropertyChanged(name: keyof AtomNotification): void {
        switch (name) {
            case "timeout":
                this.setupTimeout();
                break;
        }
    }

    protected preCreate(): void {
        super.preCreate();

        this.runAfterInit(() => {
            this.app.callLater(() => {
                this.setupTimeout();
            });
        });
        this.windowTemplate = AtomNotificationTemplate;
    }

    protected setupTimeout(): void {
        if (this.timeoutKey) {
            clearTimeout(this.timeoutKey);
        }
        this.timeoutKey = setTimeout(() => {
            this.app.broadcast(`atom-window-close:${this.element.id}`, "");
        }, this.timeout);
    }

}

export class AtomNotificationTemplate extends AtomControl {

    public create(): void {
        this.element = document.createElement("div");
        this.bind(this.element, "text", [["this", "viewModel", "message"]], false, null, this);
    }
}
