import { ModuleFiles } from "../../ModuleFiles";
import CloseButton from "../images/CloseButton";
import CloseButtonDataUrl from "../images/CloseButtonDataUrl";
import CloseButtonHover from "../images/CloseButtonHover";
import CloseButtonHoverDataUrl from "../images/CloseButtonHoverDataUrl";
import { AtomStyle } from "../styles/AtomStyle";
import { IStyleDeclaration } from "./IStyleDeclaration";

export class AtomWindowStyle extends AtomStyle {

    public get frameHost(): IStyleDeclaration {
        return {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "#50505080"
        };
    }

    public get frame(): IStyleDeclaration {
        return {
            position: "absolute",
            minHeight: "100px",
            minWidth: "300px",
            margin: "auto",
            border: "solid 1px #808080",
            fontFamily: "Arial",
            borderRadius: "5px",
            backgroundColor: "white"
        };
    }

    public get titlePresenter(): IStyleDeclaration {
        return {
            position: "relative",
            left: 0,
            right: 0,
            top: 0,
            height: "37px"
        };
    }

    public get titleHost(): IStyleDeclaration {
        return {
            position: "absolute",
            left: 0,
            right: 0,
            padding: "7px",
            minHeight: "20px",
            backgroundColor: "#404040",
            color: "white",
            top: 0,
            borderTopRightRadius: "4px",
            borderTopLeftRadius: "4px"
        };
    }

    public get title(): IStyleDeclaration {
        return {
            margin: "auto"
        };
    }

    public get closeButton(): IStyleDeclaration {
        return {
            position: "absolute",
            right: "6px",
            top: "7px",
            width: "0",
            height: "0",
            padding: "9px",
            border: "none",
            backgroundColor: "#00000000",
            backgroundImage: CloseButtonHoverDataUrl,
            // As suggested by srikanth sir
            // subclasses: {
            //     ":hover": {
            //         backgroundImage: CloseButtonHoverDataUrl
            //     }
            // }
        };
    }

    public get content(): IStyleDeclaration {
        return {
            padding: "10px",
            background: "white"
        };
    }

    public get commandBar(): IStyleDeclaration {
        return {
            left: 0,
            right: 0,
            bottom: 0,
            padding: "5px",
            backgroundColor: "#d4d4d4",
            textAlign: "right",
            borderBottomRightRadius: "4px",
            borderBottomLeftRadius: "4px"
        };
    }

    public get commandBarButton(): IStyleDeclaration {
        return {
            borderRadius: "3px",
            marginLeft: "5px",
            marginRight: "5px",
            padding: "4px 16px",
            backgroundColor: "whitesmoke",
            border: "1px solid gray"
        };
    }
}
