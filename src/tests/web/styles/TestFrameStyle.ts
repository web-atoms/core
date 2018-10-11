import { AtomStyle } from "../../../web/styles/AtomStyle";
import Box from "../../../web/styles/Box";
import { IStyleDeclaration } from "../../../web/styles/IStyleDeclaration";

export default class TestFrameStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            ... Box.box(800, 800),
            position: "absolute"
        };
    }

}
