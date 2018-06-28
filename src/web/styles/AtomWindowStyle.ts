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

    public readonly titlePresenter: AtomStyleClass = this.createClass("titlePresenter", {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "50px"
    });

    public readonly titleHost: AtomStyleClass = this.createClass("titleHost", {
        "position": "absolute",
        "left": 0,
        "right": 0,
        "padding": "5px",
        "min-height": "20px",
        "background-color": "#F0F0F0",
        "top": 0
    });
    public readonly title: AtomStyleClass = this.createClass("title", {
        margin: "auto"
    });
    public readonly closeButton: AtomStyleClass = this.createClass("close-button", {
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
    public readonly content: AtomStyleClass = this.createClass("content", {
        "position": "relative",
        "padding": "10px",
        "background": "white",
        "margin-top": "25px"
    });
    public readonly commandBar: AtomStyleClass = this.createClass("command-bar", {
        "position": "absolute",
        "left": "0",
        "right": "0",
        "bottom": "0",
        "padding": "5px",
        "background-color": "#A0A0A0",
        "text-align": "right"
    });

    public readonly commandBarButton: AtomStyleClass = this.createClass("command-bar button", {
        "border-radius": "3px",
        "margin-left": "5px",
        "margin-right": "5px"
    });
}
