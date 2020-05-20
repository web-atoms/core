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
            color: Colors.rgba(51, 51, 51)
        };
    }
    public get commandBar(): IStyleDeclaration {
        return {
            // tslint:disable-next-line:no-string-literal
            ... this.getBaseProperty(AtomAlertWindowStyle, "content"),
            padding: "0px",
            textAlign: "center",
            backgroundColor: "transparent",
            paddingBottom: "15px",
            subclasses: {
                " div > .yes-button": {
                    ...this.buttonStyle,
                    backgroundColor: Colors.rgba(0, 128, 0)
                },
                " div > .no-button": {
                    ...this.buttonStyle,
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
