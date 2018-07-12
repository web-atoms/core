import { AtomWindowStyle } from "./AtomWindowStyle";

import { AtomPopupStyle } from "./AtomPopupStyle";

import { BindableProperty } from "../../core/BindableProperty";
import { IDisposable, INotifyPropertyChanging } from "../../core/types";
import { RegisterSingleton } from "../../di/RegisterSingleton";
import { AtomListBox } from "../controls/AtomListBox";
import { AtomWindow } from "../controls/AtomWindow";
import { AtomStyleSheet } from "../styles/AtomStyleSheet";
import { AtomListBoxStyle } from "./AtomListBoxStyle";

@RegisterSingleton
export class AtomTheme extends AtomStyleSheet
    implements
        INotifyPropertyChanging,
        IDisposable {

    @BindableProperty
    public bgColor: string = "white";

    @BindableProperty
    public color: string = "gray";

    @BindableProperty
    public hoverColor: string = "lightyellow";

    @BindableProperty
    public activeColor: string = "lightblue";

    @BindableProperty
    public selectedBgColor: string = "blue";

    @BindableProperty
    public selectedColor: string = "white";

    @BindableProperty
    public padding: number = 5;

    public readonly window = this.createStyle(AtomWindow, AtomWindowStyle, "window");

    // public readonly button = this.createStyle(AtomButtonStyle, "button");

    public readonly popup = this.createNamedStyle(AtomPopupStyle, "popup");

    public readonly listBox = this.createStyle(AtomListBox, AtomListBoxStyle, "listbox");

    constructor() {
        super("atom-theme");
    }

}
