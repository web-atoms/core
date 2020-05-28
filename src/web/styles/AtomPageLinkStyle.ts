import { AtomStyle } from "./AtomStyle";
import { IStyleDeclaration } from "./IStyleDeclaration";

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
