import closeButtonHover from "@web-atoms/core/src/web/images/close-button-hover.svg";
import closeButton from "@web-atoms/core/src/web/images/images/close-button.svg";
import { AtomStyle } from "../styles/AtomStyle";
import { IStyleDeclaration } from "./IStyleDeclaration";

/**
 * Represents Window Style, in order to add more subclasses
 * you can override content style
 */
export class AtomWindowStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            ... this.frameHost,
            subclasses: {
                " .close-button": this.closeButton,
                " .command-bar-presenter": this.commandBarPresenter,
                " .command-bar": this.commandBar,
                " .content-presenter": this.contentPresenter,
                " .content": this.content,
                " .frame": this.frame,
                " .title": this.title,
                " .title-host": this.titleHost,
                " .title-presenter": this.titlePresenter,
            }
        };
    }

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
            minHeight: "32px",
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
            backgroundColor: "transparent",
            backgroundImage: closeButtonHover
            // As suggested by srikanth sir
            //  subclasses: {
            //      ":hover": {
            //          backgroundImage: closeButtonHover
            //      }
            // }
        };
    }

    public get content(): IStyleDeclaration {
        return {
        };
    }

    public get contentPresenter(): IStyleDeclaration {
        return {
            position: "relative",
            padding: "10px",
            background: "white"
        };
    }

    public get commandBarPresenter(): IStyleDeclaration {
        return {
            left: 0,
            right: 0,
            bottom: 0,
            padding: "5px",
            backgroundColor: "#d4d4d4",
            textAlign: "right",
            borderBottomRightRadius: "4px",
            borderBottomLeftRadius: "4px",
        };
    }

    public get commandBar(): IStyleDeclaration {
        return {
            subclasses: {
                " button": {
                    borderRadius: "3px",
                    marginLeft: "5px",
                    marginRight: "5px",
                    padding: "4px 16px",
                    backgroundColor: "whitesmoke",
                    border: "1px solid gray"
                }
            },
        };
    }
}
