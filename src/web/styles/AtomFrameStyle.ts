import { AtomStyle } from "./AtomStyle.js";
import { IStyleDeclaration } from "./IStyleDeclaration.js";
import StyleBuilder from "./StyleBuilder.js";

export default class AtomFrameStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            ... StyleBuilder.newStyle.absolute(0, 0).toStyle(),
            width: "100%",
            height: "100%",
            subclasses: {
                " > *": {
                    ... StyleBuilder.newStyle.absolute(0, 0).toStyle(),
                    width: "100%",
                    height: "100%",
                }
            }
        };
    }

}
