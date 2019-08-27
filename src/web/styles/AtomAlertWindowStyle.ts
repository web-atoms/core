import Colors from "../../core/Colors";
import { AtomWindowStyle } from "./AtomWindowStyle";
import { IStyleDeclaration } from "./IStyleDeclaration";

export default class AtomAlertWindowStyle extends AtomWindowStyle {

    public get frame(): IStyleDeclaration {
        return {
        // tslint:disable-next-line:no-string-literal
            ... this.getBaseProperty(AtomAlertWindowStyle, "frame"),
            color: Colors.black,
            backgroundColor: Colors.white
        };
    }

    public get titleHost(): IStyleDeclaration {
        return {
            // tslint:disable-next-line:no-string-literal
                ... this.getBaseProperty(AtomAlertWindowStyle, "titleHost"),
            backgroundColor: "white",
            color: "#2e2e2e",
            fontSize: "25px",
            fontWeight: "500",
            borderTopRightRadius: "3px",
            borderTopLeftRadius: "3px",
            textAlign: "center",
            padding: "25px"
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
            backgroundColor: Colors.white
        };
    }

    public get yesButtonStyle(): IStyleDeclaration {
        return {
            ...this.buttonStyle,
            backgroundColor: Colors.rgba(0, 255, 0, 0.5)
        };
    }

    public get noButtonStyle(): IStyleDeclaration {
        return {
            ...this.buttonStyle,
            backgroundColor: Colors.rgba(252, 113, 106, 1)
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
