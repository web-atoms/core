import { App } from "../../App.js";
import { AtomToggleButtonBarStyle } from "../styles/AtomToggleButtonBarStyle.js";
import { AtomControl } from "./AtomControl.js";
import { AtomItemsControl } from "./AtomItemsControl.js";
import { AtomListBox } from "./AtomListBox.js";

export class AtomToggleButtonBar extends AtomListBox {

    constructor(app: App, e?: HTMLElement) {
        super(app, e || document.createElement("ul"));
    }

    protected preCreate(): void {
        super.preCreate();
        this.allowMultipleSelection = false;
        this.allowSelectFirst = true;
        this.itemTemplate = AtomToggleButtonBarItemTemplate;
        this.defaultControlStyle = AtomToggleButtonBarStyle;
        this.registerItemClick();
        this.runAfterInit(() => this.setElementClass(this.element, {
            [this.controlStyle.name]: 1,
            "atom-toggle-button-bar": 1
        }, true ));
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
