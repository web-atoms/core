import { App } from "../../App";
import { AtomToggleButtonBarStyle } from "../styles/AtomToggleButtonBarStyle";
import { AtomControl } from "./AtomControl";
import { AtomItemsControl } from "./AtomItemsControl";
import { AtomListBox } from "./AtomListBox";

export class AtomToggleButtonBar extends AtomListBox {

    constructor(app: App, e?: HTMLElement) {
        super(app, e || document.createElement("ul"));
    }

    protected preCreate(): void {
        this.allowMultipleSelection = false;
        this.allowSelectFirst = true;
        this.itemTemplate = AtomToggleButtonBarItemTemplate;
        this.defaultControlStyle = AtomToggleButtonBarStyle;
        this.registerItemClick();
    }
}

class AtomToggleButtonBarItemTemplate extends AtomControl {

    constructor(app: App, e?: HTMLElement) {
        super(app, e || document.createElement("li"));
    }

    protected create(): void {
        this.bind(this.element, "text", [["data"]], false, (v) => {
            const p = this.parent as AtomItemsControl;
            return v[p.labelPath];
        });
    }

}
