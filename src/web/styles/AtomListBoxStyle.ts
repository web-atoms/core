import { BindableProperty } from "../../core/BindableProperty";
import {AtomStyleClass } from "../styles/AtomStyleClass";
import { AtomStyle } from "./AtomStyle";
import { AtomTheme } from "./AtomTheme";

export class AtomListBoxStyle extends AtomStyle {

    @BindableProperty
    public padding: string = "5px";

    public get theme(): AtomTheme {
        return this.styleSheet as AtomTheme;
    }

    public readonly item: AtomStyleClass = this.createClass("item", {
        backgroundColor: this.theme.bgColor,
        color: this.theme.color,
        padding: this.padding,
        borderRadius: this.padding
    });

    public readonly selectedItem: AtomStyleClass = this.item.clone("selected-item", {
            backgroundColor: this.theme.selectedBgColor,
            color: this.theme.selectedColor
        });

}
