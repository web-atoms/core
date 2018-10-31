import { AtomStyle } from "../../../web/styles/AtomStyle";
import { IStyleDeclaration } from "../../../web/styles/IStyleDeclaration";
import StyleBuilder from "../../../web/styles/StyleBuilder";

export default class TestFrameStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            ... StyleBuilder.newStyle.size(800, 800).toStyle(),
            position: "absolute"
        };
    }

}
