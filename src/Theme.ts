import { IDisposable, INotifyPropertyChanging } from "./core/types";
import { RegisterSingleton } from "./di/RegisterSingleton";
import { ServiceProvider } from "./di/ServiceProvider";
import { AtomStyle } from "./styles/AtomStyle";
import { AtomStyleSheet } from "./styles/AtomStyleSheet";

@RegisterSingleton
export class AtomTheme extends AtomStyleSheet
    implements
        INotifyPropertyChanging,
        IDisposable {

    public readonly window = this.createStyle(AtomWindowStyle, "window");

    public readonly button = this.createStyle(AtomButtonStyle, "button");

    public readonly popup = this.createStyle(AtomPopupStyle, "popup");

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

ServiceProvider.global.get(AtomTheme);

export class AtomButtonStyle extends AtomStyle {
    // empty
}

export class AtomPopupStyle extends AtomStyle {

    public readonly host = this.createClass("popup", {
            "background-color": "white",
            "border": "solid 1px lightgray",
            "padding": "5px",
            "border-radius": "5px"
        });

}

export class AtomWindowStyle extends AtomStyle {

    public readonly frameHost = this.createClass("frameHost", {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });

    public readonly frame = this.createClass("frame", {
            "position": "absolute",
            "left": 0,
            "right": 0,
            "top": 0,
            "bottom": 0,
            "max-width": "100%",
            "max-height": "100%",
            "margin": "auto",
            "border": "solid 1px #808080",
            "font-family": "Arial",
            "border-radius": "5px",
            "padding": "5px"
        });

    public readonly titleHost = this.createClass("titleHost", {
            "position": "absolute",
            "left": 0,
            "right": 0,
            "padding": "5px",
            "min-height": "20px",
            "background-color": "#F0F0F0",
            "top": 0
        });

    public readonly title = this.createClass("title", {
            margin: "auto"
        });

    public readonly closeButton = this.createClass("close-button", {
            "position": "absolute",
            "right": "5px",
            "top": 0,
            "bottom": 0,
            "padding": 0,
            "color": "white",
            "border": "none",
            "background-color": "red",
            "margin": "auto",
            "height": "20px",
            "border-radius": "10px",
            "width": "20px",
            "vertical-align": "middle",
            "text-align": "center"
        });

    public readonly content = this.createClass("content", {
            "position": "relative",
            "padding": "10px",
            "background": "white",
            "margin-top": "25px"
        });

    public readonly commandBar = this.createClass("command-bar", {
            "position": "absolute",
            "left": "0",
            "right": "0",
            "bottom": "0",
            "padding": "5px",
            "background-color": "#A0A0A0",
            "text-align": "right"
        });

    public readonly commandBarButton = this.createClass("command-bar button", {
            "border-radius": "3px",
            "margin-left": "5px",
            "margin-right": "5px"
        });
}
