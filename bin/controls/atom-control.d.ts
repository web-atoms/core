import { AtomComponent } from "../core/atom-component";
import { IAtomElement } from "../core/types";
export declare class AtomControl extends AtomComponent {
    element: IAtomElement;
    private mData;
    readonly data: any;
    readonly parent: AtomControl;
    constructor(e: IAtomElement);
}
