import { AtomListBoxStyle } from "./AtomListBoxStyle";
import { AtomStyleSheet } from "./AtomStyleSheet";
import { AtomTheme } from "./AtomTheme";

export class AtomToggleButtonBarStyle extends AtomListBoxStyle {

    protected init(): void {
        this.item.updateStyle(() => ({
            borderRadius: 0,
            display: "inline-block",
            border: "1px solid",
            borderLeft: "none",
            borderColor: this.theme.bgColor
        }));
        this.selectedItem.updateStyle(() => ({
            borderRadius: 0,
            display: "inline-block",
            border: "1px solid",
            borderLeft: "none",
            borderColor: this.theme.bgColor
        }));
        this.item.subClass(":first-child", () => ({
            borderTopLeftRadius: `${this.padding || this.theme.padding}px`,
            borderBottomLeftRadius: `${this.padding || this.theme.padding}px`,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderLeft: "1px solid"
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
