import { AtomComponent } from "../core/atom-component";
import { IAtomElement } from "../core/types";
export declare class AtomControl extends AtomComponent {
    element: IAtomElement;
    private mData;
    data: any;
    private mViewModel;
    viewModel: any;
    private mLocalViewModel;
    localViewModel: any;
    readonly parent: AtomControl;
    readonly templateParent: AtomControl;
    constructor(e: IAtomElement);
    dispose(e?: IAtomElement): void;
    private refreshInherited(name, fx);
}
