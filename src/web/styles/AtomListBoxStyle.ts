import { BindableProperty } from "../../core/BindableProperty";
import {AtomStyleClass } from "../styles/AtomStyleClass";
import { AtomStyle } from "./AtomStyle";
import { AtomTheme } from "./AtomTheme";

export class AtomListBoxStyle extends AtomStyle {

    @BindableProperty
    public padding: number;

    public get theme(): AtomTheme {
        return this.styleSheet as AtomTheme;
    }

    public readonly item: AtomStyleClass = this.createClass("item", {
        backgroundColor: this.theme.bgColor,
        color: this.theme.color,
        padding: (this.padding || this.theme.padding) + "px",
        borderRadius: (this.padding || this.theme.padding) + "px"
    });

    public readonly selectedItem: AtomStyleClass = this.item.clone("selected-item", {
            backgroundColor: this.theme.selectedBgColor,
            color: this.theme.selectedColor
        });

}
