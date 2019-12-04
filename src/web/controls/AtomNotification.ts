import { BindableProperty } from "../../core/BindableProperty";
import AtomNotificationStyle from "../styles/AtomNotificationStyle";
import { AtomControl } from "./AtomControl";

export default class AtomNotification extends AtomControl {

    @BindableProperty
    public timeout: number = 5000;

    private timeoutKey: any = null;

    public onPropertyChanged(name: keyof AtomNotification): void {
        switch (name) {
            case "timeout":
                this.setupTimeout();
                break;
        }
    }

    public create(): void {
        this.defaultControlStyle = AtomNotificationStyle;
        this.bind(this.element, "formattedText", [["this", "viewModel", "message"]], false, null, this);
        this.bind(this.element, "timeout", [["this", "viewModel", "timeout"]], false, (v) => v || 5000 , this);
        this.bind(this.element,
            "styleClass",
            [["this", "viewModel", "type"]],
            false,
            (type) => ({
                [this.controlStyle.root]: true,
                error: type && /error/i.test(type),
                warning: type && /warn/i.test(type)
            }), this);
    }

    protected setupTimeout(): void {
        if (this.timeoutKey) {
            clearTimeout(this.timeoutKey);
        }
        this.timeoutKey = setTimeout(() => {
            if (this.element) {
                this.app.broadcast(`atom-window-close:${this.element.id}`, "");
            }
        }, this.timeout);
    }
}
