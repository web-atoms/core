import { AtomStyle } from "../styles/AtomStyle";
import { AtomStyleClass } from "./AtomStyleClass";
export class AtomPopupStyle extends AtomStyle {
    public readonly host = this.createClass("popup", {
        "background-color": "white",
        "border": "solid 1px lightgray",
        "padding": "5px",
        "border-radius": "5px"
    });
}
