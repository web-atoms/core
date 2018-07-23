import { AtomStyle } from "../styles/AtomStyle";
import {AtomStyleClass } from "../styles/AtomStyleClass";
export class AtomPopupStyle extends AtomStyle {
    public readonly host: AtomStyleClass = this.createClass("popup", () => ({
        backgroundColor: "white",
        border: "solid 1px lightgray",
        padding: "5px",
        borderRadius: "5px"
    }));
}
