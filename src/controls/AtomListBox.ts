import { AtomUI } from "../core/atom-ui";
import { AtomControl, IAtomControlElement } from "./AtomControl";
import { AtomItemsControl } from "./AtomItemsControl";

export class AtomListBox extends AtomItemsControl {

    public updateSelectionBindings(): void {
        super.updateSelectionBindings();

        for (const i of AtomUI.childEnumerator(this.itemsPresenter)) {
            const child = (i as IAtomControlElement).atomControl;
            
        }
    }

    protected createChild(df: DocumentFragment, data: any): AtomControl {
        const child = super.createChild(df, data);
        child.bindEvent(child.element, "click", (e) => {
            this.toggleSelection(data);
        });
        return child;
    }

}
