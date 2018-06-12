import { AtomUI } from "../core/atom-ui";
import { AtomControl, IAtomControlElement } from "./AtomControl";
import { AtomItemsControl } from "./AtomItemsControl";

export class AtomListBox extends AtomItemsControl {

    public selectItemOnClick: boolean = true;

    public updateSelectionBindings(): void {
        super.updateSelectionBindings();

        for (const i of AtomUI.childEnumerator(this.itemsPresenter)) {
            const child = (i as IAtomControlElement).atomControl;
            if (child) {
                if (this.selectedItems.find( (x) => x === child.data)) {
                    child.element.classList.add("item-selected");
                } else {
                    child.element.classList.remove("item-selected");
                }
            }
        }
    }

    protected createChild(df: DocumentFragment, data: any): AtomControl {
        const child = super.createChild(df, data);
        child.bindEvent(child.element, "click", (e) => {
            if (this.selectItemOnClick) {
                this.toggleSelection(data);
            }
        });
        return child;
    }

}
