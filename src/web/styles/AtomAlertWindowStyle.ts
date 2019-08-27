import Colors from "../../core/Colors";
import { AtomWindowStyle } from "./AtomWindowStyle";
import { IStyleDeclaration } from "./IStyleDeclaration";

export default class AtomAlertWindowStyle extends AtomWindowStyle {

    public get titleHost(): IStyleDeclaration {
        return {
            // tslint:disable-next-line:no-string-literal
                ... this.getBaseProperty(AtomAlertWindowStyle, "titleHost"),
                color: Colors.black,
                backgroundColor: Colors.white
        };
    }

    public get content(): IStyleDeclaration {
        return {
            // tslint:disable-next-line:no-string-literal
            ... this.getBaseProperty(AtomAlertWindowStyle, "content"),
            padding: "0px 10px 30px 10px",
            textAlign: "center",
            color: Colors.rgba(102, 102, 102)
        };
    }
    public get commandBar(): IStyleDeclaration {
        return {
            // tslint:disable-next-line:no-string-literal
            ... this.getBaseProperty(AtomAlertWindowStyle, "content"),
            padding: "0px",
            textAlign: "center",
            backgroundColor: Colors.white,
            subclasses: {
                " div > .yes-button": {
                    ...this.buttonStyle,
                    backgroundColor: Colors.rgba(0, 255, 0, 0.5)
                },
                " div > .no-button": {
                    ...this.buttonStyle,
                    backgroundColor: Colors.rgba(252, 113, 106, 1)
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
