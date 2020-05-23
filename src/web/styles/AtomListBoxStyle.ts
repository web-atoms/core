import { BindableProperty } from "../../core/BindableProperty";
import { AtomStyle } from "./AtomStyle";
import { AtomTheme } from "./AtomTheme";
import { IStyleDeclaration } from "./IStyleDeclaration";

export class AtomListBoxStyle extends AtomStyle {

    public padding: number;

    public get root(): IStyleDeclaration {
        return {
            subclasses: {
                " .item": this.item,
                " .selected-item": this.selectedItem
            }
        };
    }

    public get theme(): AtomTheme {
        return this.styleSheet as AtomTheme;
    }

    public get item(): IStyleDeclaration {
        return {
            backgroundColor: this.theme.bgColor,
            color: this.theme.color,
            padding: (this.padding || this.theme.padding) + "px",
            borderRadius: (this.padding || this.theme.padding) + "px",
            cursor: "pointer"
        };
    }

    public get selectedItem(): IStyleDeclaration {
        return {
            ... this.item,
            backgroundColor: this.theme.selectedBgColor,
            color: this.theme.selectedColor,
            cursor: "pointer"
        };
    }

}
