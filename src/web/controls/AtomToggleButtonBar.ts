import { AtomToggleButtonBarStyle } from "../styles/AtomToggleButtonBarStyle";
import { AtomControl } from "./AtomControl";
import { AtomItemsControl } from "./AtomItemsControl";
import { AtomListBox } from "./AtomListBox";

export class AtomToggleButtonBar extends AtomListBox {

    protected preCreate(): void {
        if (!this.element) {
            this.element = document.createElement("ul");
        }
        this.allowMultipleSelection = false;
        this.allowSelectFirst = true;
        this.itemTemplate = AtomToggleButtonBarItemTemplate;
        this.defaultControlStyle = AtomToggleButtonBarStyle;
    }
}

class AtomToggleButtonBarItemTemplate extends AtomControl {

    protected create(): void {
        this.element = document.createElement("li");
        this.bind(this.element, "text", [["data"]], false, (v) => {
            const p = this.parent as AtomItemsControl;
            return v[p.labelPath];
        });
    }

}
