import { AtomWindowStyle } from "./AtomWindowStyle.js";

import { AtomPopupStyle } from "./AtomPopupStyle.js";

import { App } from "../../App.js";
import { BindableProperty } from "../../core/BindableProperty.js";
import Color from "../../core/Color.js";
import Colors, { ColorItem } from "../../core/Colors.js";
import { IDisposable, INotifyPropertyChanging } from "../../core/types.js";
import { Inject } from "../../di/Inject.js";
import { RegisterSingleton } from "../../di/RegisterSingleton.js";
import { NavigationService } from "../../services/NavigationService.js";
import { AtomListBox } from "../controls/AtomListBox.js";
import { AtomWindow } from "../controls/AtomWindow.js";
import { AtomStyleSheet } from "../styles/AtomStyleSheet.js";
import { AtomListBoxStyle } from "./AtomListBoxStyle.js";

@RegisterSingleton
export class AtomTheme extends AtomStyleSheet
    implements
        INotifyPropertyChanging,
        IDisposable {

    public bgColor: ColorItem = Colors.white;

    public color: ColorItem = Colors.gray;

    public hoverColor: ColorItem = Colors.lightGray;

    public activeColor: ColorItem = Colors.lightBlue;

    public selectedBgColor: ColorItem = Colors.blue;

    public selectedColor: ColorItem = Colors.white;

    public padding: number = 5;

    // public readonly window = this.createStyle(AtomWindow, AtomWindowStyle, "window");

    // public readonly popup = this.createNamedStyle(AtomPopupStyle, "popup");

    constructor(
        @Inject app: App,
        @Inject private navigationService: NavigationService) {
        super(app, "atom-theme");

        setTimeout(() => {
            window.addEventListener("resize", () => {
                setTimeout(() => {
                    this.pushUpdate();
                }, 10);
            });
            document.body.addEventListener("resize", () => {
                setTimeout(() => {
                    this.pushUpdate();
                }, 10);
            });
        }, 1000);
    }

}
