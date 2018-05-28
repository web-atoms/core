import { AtomComponent } from "../core/atom-component";
import { AtomUI } from "../core/atom-ui";
import { AtomElementExtensions, IAtomElement, INativeComponent } from "../core/types";

export class AtomControl extends AtomComponent {

    public element: IAtomElement;

    private mData: any = undefined;
    public get data(): any {
        if (this.mData !== undefined) {
            return this.mData;
        }
        const parent = this.parent;
        if (parent) {
            return parent.data;
        }
        return undefined;
    }

    public get parent(): AtomControl {
        const e = this.element;
        if (e instanceof HTMLElement) {
            return AtomUI.parent(e as HTMLElement);
        }
        return AtomElementExtensions.parent(e as INativeComponent);
    }

    constructor(e: IAtomElement) {
        super();
        this.element = e;
    }
}
