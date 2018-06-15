import { AtomStyle } from "../styles/AtomStyle";
import "./AtomStyleClass";
export class AtomWindowStyle extends AtomStyle {
    public readonly frameHost = this.createClass("frameHost", {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    });
    public readonly frame = this.createClass("frame", {
        "position": "absolute",
        "left": 0,
        "right": 0,
        "top": 0,
        "bottom": 0,
        "max-width": "100%",
        "max-height": "100%",
        "margin": "auto",
        "border": "solid 1px #808080",
        "font-family": "Arial",
        "border-radius": "5px",
        "padding": "5px"
    });
    public readonly titleHost = this.createClass("titleHost", {
        "position": "absolute",
        "left": 0,
        "right": 0,
        "padding": "5px",
        "min-height": "20px",
        "background-color": "#F0F0F0",
        "top": 0
    });
    public readonly title = this.createClass("title", {
        margin: "auto"
    });
    public readonly closeButton = this.createClass("close-button", {
        "position": "absolute",
        "right": "5px",
        "top": 0,
        "bottom": 0,
        "padding": 0,
        "color": "white",
        "border": "none",
        "background-color": "red",
        "margin": "auto",
        "height": "20px",
        "border-radius": "10px",
        "width": "20px",
        "vertical-align": "middle",
        "text-align": "center"
    });
    public readonly content = this.createClass("content", {
        "position": "relative",
        "padding": "10px",
        "background": "white",
        "margin-top": "25px"
    });
    public readonly commandBar = this.createClass("command-bar", {
        "position": "absolute",
        "left": "0",
        "right": "0",
        "bottom": "0",
        "padding": "5px",
        "background-color": "#A0A0A0",
        "text-align": "right"
    });
    public readonly commandBarButton = this.createClass("command-bar button", {
        "border-radius": "3px",
        "margin-left": "5px",
        "margin-right": "5px"
    });
}
