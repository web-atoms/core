import { bindableProperty } from "../core/bindable-properties";
import {AtomStyleClass } from "../styles/AtomStyleClass";
import { AtomStyle } from "./AtomStyle";
import { AtomTheme } from "./Theme";

export class AtomListBoxStyle extends AtomStyle {

    @bindableProperty
    public padding: string = "5px";

    public get theme(): AtomTheme {
        return this.styleSheet as AtomTheme;
    }

    public readonly item: AtomStyleClass = this.createClass("item", {
        "background-color": this.theme.bgColor,
        "color": this.theme.color,
        "padding": this.padding,
        "border-radius": this.padding
    });

    public readonly selectedItem: AtomStyleClass = this.item.clone("selected-item", {
            "background-color": this.theme.selectedBgColor,
            "color": this.theme.selectedColor
        });

}
