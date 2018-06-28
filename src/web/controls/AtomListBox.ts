import { BindableProperty } from "../../core/BindableProperty";
import { AtomUI, ChildEnumerator } from "../../web/core/AtomUI";
import { AtomListBoxStyle } from "../styles/AtomListBoxStyle";
import { AtomControl, IAtomControlElement } from "./AtomControl";
import { AtomItemsControl } from "./AtomItemsControl";

export class AtomListBox extends AtomItemsControl {

    public selectItemOnClick: boolean = true;

    public updateSelectionBindings(): void {
        super.updateSelectionBindings();

        const style = this.controlStyle as AtomListBoxStyle;

        const selectedClass = style.selectedItem.className;

        const ip = this.itemsPresenter || this.element;
        const en = new ChildEnumerator(ip);
        while (en.next()) {
            const i = en.current;
            const child = (i as IAtomControlElement).atomControl;
            if (child) {
                if (this.selectedItems.find( (x) => x === child.data)) {
                    child.element.classList.add(selectedClass);
                } else {
                    child.element.classList.remove(selectedClass);
                }
            }
        }
    }

    protected createChild(df: DocumentFragment, data: any): AtomControl {
        const style = this.controlStyle as AtomListBoxStyle;
        const item = style.item;
        const child = super.createChild(df, data);
        child.element.classList.add(item.className);
        child.bindEvent(child.element, "click", (e) => {
            if (this.selectItemOnClick) {
                this.toggleSelection(data);
            }
        });
        return child;
    }

}
