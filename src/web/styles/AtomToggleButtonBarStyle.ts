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
        this.item.subClass(":first-child", () => ({
            borderTopLeftRadius: `${this.padding || this.theme.padding}px`,
            borderBottomLeftRadius: `${this.padding || this.theme.padding}px`,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
        }));
        this.item.subClass(":last-child", () => ({
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: `${this.padding || this.theme.padding}px`,
            borderBottomRightRadius: `${this.padding || this.theme.padding}px`
        }));
        this.selectedItem.subClass(":first-child", () => ({
            borderTopLeftRadius: `${this.padding || this.theme.padding}px`,
            borderBottomLeftRadius: `${this.padding || this.theme.padding}px`,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
        }));
        this.selectedItem.subClass(":last-child", () => ({
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: `${this.padding || this.theme.padding}px`,
            borderBottomRightRadius: `${this.padding || this.theme.padding}px`
        }));
    }

}
