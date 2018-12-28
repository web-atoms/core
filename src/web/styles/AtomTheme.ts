import { AtomWindowStyle } from "./AtomWindowStyle";

import { AtomPopupStyle } from "./AtomPopupStyle";

import { App } from "../../App";
import { BindableProperty } from "../../core/BindableProperty";
import Color from "../../core/Color";
import Colors, { ColorItem } from "../../core/Colors";
import { IDisposable, INotifyPropertyChanging } from "../../core/types";
import { Inject } from "../../di/Inject";
import { RegisterSingleton } from "../../di/RegisterSingleton";
import { NavigationService } from "../../services/NavigationService";
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

    public readonly popup = this.createNamedStyle(AtomPopupStyle, "popup");

    constructor(
        @Inject app: App,
        @Inject private navigationService: NavigationService) {
        super(app, "atom-theme");

        setTimeout(() => {
            window.addEventListener("resize", () => {
                this.pushUpdate();
            });
            document.body.addEventListener("resize", () => {
                this.pushUpdate();
            });
        }, 1000);
    }

}
