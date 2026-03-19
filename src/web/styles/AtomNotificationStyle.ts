import Colors from "../../core/Colors.js";
import { AtomStyle } from "./AtomStyle.js";
import { IStyleDeclaration } from "./IStyleDeclaration.js";

export default class AtomNotificationStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            padding: "5px",
            borderRadius: "5px",
            border: "solid 1px lightgray",
            fontFamily: "Verdana, Geneva, sans-serif",
            fontSize: "16px",
            subclasses: {
                ".error": {
                    borderColor: Colors.red,
                    color: Colors.red,
                },
                ".warning": {
                    backgroundColor: Colors.lightYellow
                }
            }
        };
    }

}
