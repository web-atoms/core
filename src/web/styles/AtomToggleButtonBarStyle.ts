import { BindableProperty } from "../../core/BindableProperty";
import { AtomListBoxStyle } from "./AtomListBoxStyle";
import { AtomStyleSheet } from "./AtomStyleSheet";
import { AtomTheme } from "./AtomTheme";

export class AtomToggleButtonBarStyle extends AtomListBoxStyle {

    @BindableProperty
    public toggleColor: string = "blue";

    protected init(): void {
        this.item.updateStyle(() => ({
            borderRadius: 0,
            display: "inline-block",
            border: "1px solid",
            borderLeft: "none",
            color: this.toggleColor,
            borderColor: this.toggleColor
        }));
        this.selectedItem.updateStyle(() => ({
            borderRadius: 0,
            display: "inline-block",
            border: "1px solid",
            borderLeft: "none",
            borderColor: this.toggleColor
        }));
        this.item.firstChild(() => ({
            borderTopLeftRadius: `${this.padding || this.theme.padding}px`,
            borderBottomLeftRadius: `${this.padding || this.theme.padding}px`,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderLeft: "1px solid"
        }));
        this.item.lastChild(() => ({
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: `${this.padding || this.theme.padding}px`,
            borderBottomRightRadius: `${this.padding || this.theme.padding}px`
        }));
        this.selectedItem.firstChild(() => ({
            borderTopLeftRadius: `${this.padding || this.theme.padding}px`,
            borderBottomLeftRadius: `${this.padding || this.theme.padding}px`,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
        }));
        this.selectedItem.lastChild(() => ({
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: `${this.padding || this.theme.padding}px`,
            borderBottomRightRadius: `${this.padding || this.theme.padding}px`
        }));
    }

}
