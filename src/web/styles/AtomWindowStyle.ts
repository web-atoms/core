import { AtomStyle } from "../styles/AtomStyle";
import { AtomStyleClass } from "./AtomStyleClass";

export class AtomWindowStyle extends AtomStyle {
    public readonly frameHost: AtomStyleClass = this.createClass("frameHost", {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    });
    public readonly frame: AtomStyleClass = this.createClass("frame", {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        maxWidth: "100%",
        maxHeight: "100%",
        margin: "auto",
        border: "solid 1px #808080",
        fontFamily: "Arial",
        borderRadius: "5px",
        padding: "5px"
    });

    public readonly titlePresenter: AtomStyleClass = this.createClass("titlePresenter", {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "50px"
    });

    public readonly titleHost: AtomStyleClass = this.createClass("titleHost", {
        position: "absolute",
        left: 0,
        right: 0,
        padding: "5px",
        minHeight: "20px",
        backgroundColor: "#F0F0F0",
        top: 0
    });
    public readonly title: AtomStyleClass = this.createClass("title", {
        margin: "auto"
    });
    public readonly closeButton: AtomStyleClass = this.createClass("close-button", {
        position: "absolute",
        right: "5px",
        top: 0,
        bottom: 0,
        padding: 0,
        color: "white",
        border: "none",
        backgroundColor: "red",
        margin: "auto",
        height: "20px",
        borderRadius: "10px",
        width: "20px",
        verticalAlign: "middle",
        textAlign: "center"
    });
    public readonly content: AtomStyleClass = this.createClass("content", {
        position: "relative",
        padding: "10px",
        background: "white",
        marginTop: "25px"
    });
    public readonly commandBar: AtomStyleClass = this.createClass("command-bar", {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "5px",
        backgroundColor: "#A0A0A0",
        textAlign: "right"
    });

    public readonly commandBarButton: AtomStyleClass = this.createClass("command-bar button", {
        borderRadius: "3px",
        marginLeft: "5px",
        marginRight: "5px"
    });
}
