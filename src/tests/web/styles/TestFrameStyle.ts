import { AtomStyle } from "../../../web/styles/AtomStyle.js";
import { IStyleDeclaration } from "../../../web/styles/IStyleDeclaration.js";
import StyleBuilder from "../../../web/styles/StyleBuilder.js";

export default class TestFrameStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            ... StyleBuilder.newStyle.size(800, 800).toStyle(),
            position: "absolute"
        };
    }

}
