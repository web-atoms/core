import { BindableProperty } from "../../core/BindableProperty";
import { AtomListBoxStyle } from "./AtomListBoxStyle";
import { AtomStyleSheet } from "./AtomStyleSheet";
import { AtomTheme } from "./AtomTheme";
import { IStyleDeclaration } from "./IStyleDeclaration";

export class AtomToggleButtonBarStyle extends AtomListBoxStyle {

    @BindableProperty
    public toggleColor: string = "blue";

    public get item(): IStyleDeclaration {
        return {
            // tslint:disable-next-line:no-string-literal
            ... this.getBaseProperty(AtomToggleButtonBarStyle , "item"),
            borderRadius: 0,
            display: "inline-block",
            border: "1px solid",
            borderLeft: "none",
            color: this.toggleColor,
            borderColor: this.toggleColor,
            cursor: "pointer",
            subclasses: {
                ":first-child": {
                    borderTopLeftRadius: `${this.padding || this.theme.padding}px`,
                    borderBottomLeftRadius: `${this.padding || this.theme.padding}px`,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderLeft: "1px solid"
                },
                ":last-child": {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: `${this.padding || this.theme.padding}px`,
                    borderBottomRightRadius: `${this.padding || this.theme.padding}px`
                }
            }
        };
    }

    public get selectedItem(): IStyleDeclaration {
        return {
            ... this.getBaseProperty(AtomToggleButtonBarStyle, "selectedItem"),
            borderRadius: 0,
            display: "inline-block",
            border: "1px solid",
            borderLeft: "none",
            borderColor: this.toggleColor,
            cursor: "pointer",
            subclasses: {
                ":first-child": {
                    borderTopLeftRadius: `${this.padding || this.theme.padding}px`,
                    borderBottomLeftRadius: `${this.padding || this.theme.padding}px`,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0
                },
                ":last-child": {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: `${this.padding || this.theme.padding}px`,
                    borderBottomRightRadius: `${this.padding || this.theme.padding}px`
                }
            }
        };
    }

}
