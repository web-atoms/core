import { bindableProperty } from "../core/bindable-properties";
import { AtomStyle } from "./AtomStyle";
import { AtomStyleClass } from "./AtomStyleClass";
import { AtomTheme } from "./Theme";

export class AtomListBoxStyle extends AtomStyle {

    @bindableProperty
    public padding: string = "5px";

    public get theme(): AtomTheme {
        return this.styleSheet as AtomTheme;
    }

    public readonly item = this.createClass("item", {
        "background-color": this.theme.bgColor,
        "color": this.theme.color,
        "padding": this.padding,
        "border-radius": this.padding
    });

    public readonly selectedItem = this.item.clone("selected-item", {
            "background-color": this.theme.selectedBgColor,
            "color": this.theme.selectedColor
        });

}
