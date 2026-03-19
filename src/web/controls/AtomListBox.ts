import { BindableProperty } from "../../core/BindableProperty.js";
import { AtomUI, ChildEnumerator } from "../../web/core/AtomUI.js";
import { AtomListBoxStyle } from "../styles/AtomListBoxStyle.js";
import { AtomControl } from "./AtomControl.js";
import { AtomItemsControl } from "./AtomItemsControl.js";

export class AtomListBox extends AtomItemsControl {

    public selectItemOnClick: boolean;

    protected preCreate(): void {
        this.selectItemOnClick = true;
        super.preCreate();
        this.defaultControlStyle = AtomListBoxStyle;
        this.registerItemClick();
        this.runAfterInit(() => this.setElementClass(this.element, {
            [this.controlStyle.name]: 1,
            "atom-list-box": 1
        }));
    }

    protected registerItemClick(): void {
        this.bindEvent(this.element, "click", (e) => {
            const p = this.atomParent(e.target as HTMLElement);
            if (p === this) {
                return;
            }
            if (p.element._logicalParent === this.element) {
                // this is child..
                const data = p.data;
                if (!data) {
                    return;
                }
                if (this.selectItemOnClick) {
                    this.toggleSelection(data);
                    const ce = new CustomEvent("selectionChanged", {
                        bubbles: false,
                        cancelable: false,
                        detail: data });
                    this.element.dispatchEvent(ce);
                }
            }
        });
    }

    protected createChild(df: DocumentFragment, data: any): AtomControl {
        const child = super.createChild(df, data);
        child.bind(child.element, "styleClass",
            [
                ["this", "version"],
                ["data"],
                ["this", "selectedItems"]
            ],
            false,
            (version, itemData, selectedItems: any[]) => {
                return {
                    "list-item": true,
                    "item": true,
                    "selected-item": selectedItems
                    && selectedItems.find((x) => x === itemData),
                    "selected-list-item": selectedItems
                        && selectedItems.find((x) => x === itemData)
                };
            },
            this);
        return child;
    }

}
