import { AtomControl } from "./AtomControl";
import { AtomItemsControl } from "./AtomItemsControl";

export class AtomComboBox extends AtomItemsControl {

    private isChanging: boolean;

    constructor(e?: HTMLElement) {
        super(e);
        this.allowMultipleSelection = false;
        this.bindEvent(this.element, "change", (s) => {
            if (this.isChanging) {
                return;
            }
            try {
                this.isChanging = true;
                const index = (this.element as HTMLSelectElement).selectedIndex;
                if (index === -1) {
                    this.selectedItems.clear();
                    return;
                }
                this.selectedItem = this.items[index];
                // this.selectedIndex = (this.element as HTMLSelectElement).selectedIndex;
            } finally {
                this.isChanging = false;
            }
        });
    }

    public updateSelectionBindings(): void {
        super.updateSelectionBindings();

        try {
            if (this.isChanging) {
                return;
            }
            this.isChanging = true;
            const se = this.element as HTMLSelectElement;
            se.selectedIndex = this.selectedIndex;
        } finally {
            this.isChanging = false;
        }
    }

}

class AtomComboBoxItemTemplate extends AtomControl {
    protected create(): void {
        this.element = document.createElement("option");
        this.bind(this.element, "text", [["data"]], false ,
        (v) => {
            const ip = this.templateParent as AtomItemsControl;
            return v[ip.valuePath];
        });
    }
}
