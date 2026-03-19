import Bind from "../../core/Bind.js";
import { BindableProperty } from "../../core/BindableProperty.js";
import XNode from "../../core/XNode.js";
import AtomNotificationStyle from "../styles/AtomNotificationStyle.js";
import { AtomControl } from "./AtomControl.js";

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
        this.render(<div
            formattedText={Bind.oneWay(() => this.viewModel.message )}
            timeout={Bind.oneWay(() => this.viewModel.timeout || 5000)}
            styleClass={Bind.oneWay(() => ({
                [this.controlStyle.name]: 1,
                error: this.viewModel.type && /error/i.test(this.viewModel.type),
                warning: this.viewModel.type && /warn/i.test(this.viewModel.type),
            }))}
            />);
    }

    protected setupTimeout(): void {
        if (this.timeoutKey) {
            clearTimeout(this.timeoutKey);
        }
        this.timeoutKey = setTimeout(() => {
            if (this.element) {
                this.app.broadcast(`atom-window-close:${(this as any).id}`, "");
            }
        }, this.timeout);
    }
}
