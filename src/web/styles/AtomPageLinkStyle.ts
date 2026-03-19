import { AtomStyle } from "./AtomStyle.js";
import { IStyleDeclaration } from "./IStyleDeclaration.js";

export default class AtomPageLinkStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            subclasses: {
                ".page": this.page
            }
        };
    }

    public get page(): IStyleDeclaration {
        return {};
    }

}
