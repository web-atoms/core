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
            position: "relative",
            margin: "auto",
            background: "#F0F0F0",
            border: "solid 1px #808080"
        });
    }

    @watch
    public get titleHost(): AtomStyleClass {
        return this.createClass("titleHost", {
            position: "relative",
            left: 0,
            right: 0,
            padding: "5px",
            margin: "5px"
        });
    }

    @watch
    public get title(): AtomStyleClass {
        return this.createClass("title", {
            position: "absolute",
            left: "5px",
            top: "5px"
        });
    }

    @watch
    public get closeButton(): AtomStyleClass {
        return this.createClass("close-button", {
            position: "absolute",
            right: "5px",
            top: "5px"
        });
    }

    @watch
    public get content(): AtomStyleClass {
        return this.createClass("content", {
            position: "relative",
            padding: "5px",
            background: "white"
        });
    }

    @watch
    public get commandBar(): AtomStyleClass {
        return this.createClass("command-bar", {
            "position": "absolute",
            "left": "5px",
            "right": "5px",
            "bottom": "5px",
            "padding": "5px",
            "background-color": "#A0FFFF"
        });
    }
}
