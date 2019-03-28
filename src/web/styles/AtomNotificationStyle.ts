import Colors from "../../core/Colors";
import { AtomStyle } from "./AtomStyle";
import { IStyleDeclaration } from "./IStyleDeclaration";

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
                    backgroundColor: "#FFBABA"
                },
                ".warning": {
                    backgroundColor: Colors.lightYellow
                }
            }
        };
    }

}
