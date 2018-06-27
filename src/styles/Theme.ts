import { AtomWindowStyle } from "./AtomWindowStyle";

import { AtomButtonStyle } from "./AtomButtonStyle";

import { AtomPopupStyle } from "./AtomPopupStyle";

import { bindableProperty } from "../core/BindableProperty";
import { IDisposable, INotifyPropertyChanging } from "../core/types";
import { RegisterSingleton } from "../di/RegisterSingleton";
import { ServiceProvider } from "../di/ServiceProvider";
import { AtomStyleSheet } from "../styles/AtomStyleSheet";
import { AtomListBoxStyle } from "./AtomListBoxStyle";

@RegisterSingleton
export class AtomTheme extends AtomStyleSheet
    implements
        INotifyPropertyChanging,
        IDisposable {

    @bindableProperty
    public bgColor: string = "white";

    @bindableProperty
    public color: string = "gray";

    @bindableProperty
    public activeColor: string = "lightblue";

    @bindableProperty
    public selectedBgColor: string = "blue";

    @bindableProperty
    public selectedColor: string = "white";

    public readonly window = this.createStyle(AtomWindowStyle, "window");

    public readonly button = this.createStyle(AtomButtonStyle, "button");

    public readonly popup = this.createStyle(AtomPopupStyle, "popup");

    public readonly listBox = this.createStyle(AtomListBoxStyle, "listbox");

    constructor() {
        super("atom-theme");
    }

    // public get window(): AtomWindowStyle {
    //     return this.createStyle(AtomWindowStyle, "window");
    // }

    // public get button(): AtomButtonStyle {
    //     return this.createStyle(AtomButtonStyle, "button");
    // }

    // public get popup(): AtomPopupStyle {
    //     return this.createStyle(AtomPopupStyle, "popup");
    // }

}
