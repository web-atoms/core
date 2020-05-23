import { AtomStyle } from "../styles/AtomStyle";
import { IStyleDeclaration } from "./IStyleDeclaration";
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
