import Colors from "../../core/Colors";
import { AtomStyle } from "./AtomStyle";
import { IStyleDeclaration } from "./IStyleDeclaration";

export default class AtomNotificationStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            padding: "5px",
            borderRadius: "5px",
            border: "solid 1px lightgray",
            subclasses: {
                ".error": {
                    borderColor: Colors.red,
                    color: Colors.red
                },
                ".warning": {
                    backgroundColor: Colors.lightYellow
                }
            }
        };
    }

}
