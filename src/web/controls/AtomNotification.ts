import { BindableProperty } from "../../core/BindableProperty";
import { AtomControl } from "./AtomControl";

export default class AtomNotification extends AtomControl {

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

    public create(): void {
        this.element = document.createElement("div");
        this.bind(this.element, "text", [["this", "viewModel", "message"]], false, null, this);
        this.element.style.opacity = "0";
        this.bind(this.element, "timeout", [["this", "viewModel", "timeout"]], false, (v) => v || 3000 );
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
