import { Atom } from "../../Atom.js";
import Colors from "../../core/Colors.js";
import { AtomWindowStyle } from "./AtomWindowStyle.js";
import { IStyleDeclaration } from "./IStyleDeclaration.js";

export default class AtomAlertWindowStyle extends AtomWindowStyle {

    public get titleHost(): IStyleDeclaration {
        return {
                ... this.getBaseProperty(AtomAlertWindowStyle, "titleHost"),
                color: Colors.black,
                backgroundColor: Colors.white
        };
    }

    public get contentPresenter(): IStyleDeclaration {
        return {
            ... this.getBaseProperty(AtomAlertWindowStyle, "contentPresenter"),
            padding: "0px 10px 30px 10px",
            textAlign: "center",
            color: Colors.rgba(51, 51, 51)
        };
    }

    public get commandBar(): IStyleDeclaration {
        return {
            ... this.getBaseProperty(AtomAlertWindowStyle, "commandBar"),
            textAlign: "center",
            subclasses: {
                " button": this.buttonStyle,
                " .yes-button": {
                    backgroundColor: Colors.rgba(0, 128, 0)
                },
                " .no-button": {
                    backgroundColor: Colors.rgba(255, 0, 0)
                }

            }
        };
    }

    public get buttonStyle(): IStyleDeclaration {
        return {
            border: "none",
            color: Colors.white,
            width: "50%",
            height: "40px"
        };
    }

}
