import { AtomStyle } from "../styles/AtomStyle.js";
import { IStyleDeclaration } from "./IStyleDeclaration.js";
export class AtomPopupStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            backgroundColor: "white",
            border: "solid 1px lightgray",
            padding: "5px",
            borderRadius: "5px"
        };
    }
}
