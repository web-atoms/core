import { AtomListBoxStyle } from "./AtomListBoxStyle";
import { AtomStyleSheet } from "./AtomStyleSheet";
import { AtomTheme } from "./AtomTheme";

export class AtomToggleButtonBarStyle extends AtomListBoxStyle {

    protected init(): void {
        this.item.updateStyle(() => ({
            borderRadius: 0,
            display: "inline-block"
        }));
        this.selectedItem.updateStyle(() => ({
            borderRadius: 0,
            display: "inline-block"
        }));
        this.item.subClass("> *:first-child", () => ({
            borderTopLeftRadius: `${this.padding}px`,
            borderBottomLeftRadius: `${this.padding}px`,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
        }));
        this.selectedItem.subClass("> *:last-child", () => ({
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: `${this.padding}px`,
            borderBottomRightRadius: `${this.padding}px`
        }));
    }

}
