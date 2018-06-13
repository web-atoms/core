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
    public get frame(): AtomStyleClass {
        return this.createClass("frame", {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });
    }

    @watch
    public get titleHost(): AtomStyleClass {
        return this.createClass("frameHost", {
            position: "relative",
            width: "100%",
            height: "100%",
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
            position: "absolute",
            right: "5px",
            top: "5px"
        });
    }

    @watch
    public get commandBar(): AtomStyleClass {
        return this.createClass("command-bar", {
            position: "absolute",
            right: "5px",
            top: "5px"
        });
    }
}
