import { AtomWindowStyle } from "./AtomWindowStyle";

import { AtomPopupStyle } from "./AtomPopupStyle";

import { BindableProperty } from "../../core/BindableProperty";
import Color from "../../core/Color";
import Colors, { ColorItem } from "../../core/Colors";
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
    public bgColor: ColorItem = Colors.white;

    @BindableProperty
    public color: ColorItem = Colors.gray;

    @BindableProperty
    public hoverColor: ColorItem = Colors.lightGray;

    @BindableProperty
    public activeColor: ColorItem = Colors.lightBlue;

    @BindableProperty
    public selectedBgColor: ColorItem = Colors.blue;

    @BindableProperty
    public selectedColor: ColorItem = Colors.white;

    @BindableProperty
    public padding: number = 5;

    public readonly window = this.createStyle(AtomWindow, AtomWindowStyle, "window");

    // public readonly button = this.createStyle(AtomButtonStyle, "button");

    public readonly popup = this.createNamedStyle(AtomPopupStyle, "popup");

    // public readonly listBox = this.createStyle(AtomListBox, AtomListBoxStyle, "listbox");

    constructor() {
        super("atom-theme");
    }

}
