import { bindableProperty } from "./core/bindable-properties";
import { IDisposable, INameValuePairs, INotifyPropertyChanged, INotifyPropertyChanging } from "./core/types";
import { RegisterSingleton } from "./di/RegisterSingleton";
import { ServiceProvider } from "./di/ServiceProvider";
import { AtomStyle } from "./styles/AtomStyle";
import { AtomStyleClass } from "./styles/AtomStyleClass";
import { AtomStyleSheet } from "./styles/AtomStyleSheet";
import { watch } from "./view-model/AtomViewModel";

@RegisterSingleton
export class AtomTheme extends AtomStyleSheet
    implements
        INotifyPropertyChanging,
        IDisposable {

    constructor() {
        super("atom-theme");
    }

    @watch
    public get window(): AtomWindowStyle {
        return this.createStyle(AtomWindowStyle, "window");
    }

    @watch
    public get button(): AtomButtonStyle {
        return this.createStyle(AtomButtonStyle, "button");
    }

}

ServiceProvider.global.get(AtomTheme);

export class AtomButtonStyle extends AtomStyle {
    // empty
}

export class AtomWindowStyle extends AtomStyle {

    @watch
    public get frameHost(): AtomStyleClass {
        return this.createClass("frameHost", {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });
    }

    @watch
    public get frame(): AtomStyleClass {
        return this.createClass("frame", {
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
    }

    @watch
    public get titleHost(): AtomStyleClass {
        return this.createClass("titleHost", {
            "position": "absolute",
            "left": 0,
            "right": 0,
            "padding": "5px",
            "min-height": "20px",
            "background-color": "#F0F0F0",
            "top": 0
        });
    }

    @watch
    public get title(): AtomStyleClass {
        return this.createClass("title", {
            margin: "auto"
        });
    }

    @watch
    public get closeButton(): AtomStyleClass {
        return this.createClass("close-button", {
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
    }

    @watch
    public get content(): AtomStyleClass {
        return this.createClass("content", {
            "position": "relative",
            "padding": "10px",
            "background": "white",
            "margin-top": "25px"
        });
    }

    @watch
    public get commandBar(): AtomStyleClass {
        return this.createClass("command-bar", {
            "position": "absolute",
            "left": "0",
            "right": "0",
            "bottom": "0",
            "padding": "5px",
            "background-color": "#A0A0A0",
            "text-align": "right"
        });
    }

    @watch
    public get commandBarButton(): AtomStyleClass {
        return this.createClass("command-bar button", {
            "border-radius": "3px",
            "margin-left": "5px",
            "margin-right": "5px"
        });
    }
}
