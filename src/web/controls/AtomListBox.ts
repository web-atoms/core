import { BindableProperty } from "../../core/BindableProperty";
import { AtomUI, ChildEnumerator } from "../../web/core/AtomUI";
import { AtomListBoxStyle } from "../styles/AtomListBoxStyle";
import { AtomControl, IAtomControlElement } from "./AtomControl";
import { AtomItemsControl } from "./AtomItemsControl";

export class AtomListBox extends AtomItemsControl {

    public selectItemOnClick: boolean = true;

    protected createChild(df: DocumentFragment, data: any): AtomControl {
        const child = super.createChild(df, data);
        child.bindEvent(child.element, "click", (e) => {
            if (this.selectItemOnClick) {
                this.toggleSelection(data);
            }
        });
        child.bind(child.element, "styleClass",
            [
                ["this", "version"],
                ["data"],
                ["this", "selectedItems"],
                ["this", "controlStyle", "item"],
                ["this", "controlStyle", "selectedItem"]
            ],
            false,
            (version, itemData, selectedItems: any[], item, selectedItem) => {
                return selectedItems ?
                    (selectedItems.indexOf(itemData) === -1) ? selectedItem : item
                :
                    item;
            },
            this);
        return child;
    }

}
