import { Atom } from "../atom";
import { AtomBinder } from "../core/atom-binder";
import { AtomComponent } from "../core/atom-component";
import { AtomUI } from "../core/atom-ui";
import { AtomBridge } from "../core/bridge";
import { IAtomElement, INativeComponent } from "../core/types";

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

    public set data(v: any) {
        this.mData = v;
        this.refreshInherited("data", (a) => a.mData === undefined);
    }

    private mViewModel: any = undefined;
    public get viewModel(): any {
        if (this.mViewModel !== undefined) {
            return this.mViewModel;
        }
        const parent = this.parent;
        if (parent) {
            return parent.viewModel;
        }
        return undefined;
    }

    public set viewModel(v: any) {
        this.mViewModel = v;
        this.refreshInherited("viewModel", (a) => a.mViewModel === undefined);
    }

    private mLocalViewModel: any = undefined;
    public get localViewModel(): any {
        if (this.mLocalViewModel !== undefined) {
            return this.mLocalViewModel;
        }
        const parent = this.parent;
        if (parent) {
            return parent.localViewModel;
        }
        return undefined;
    }

    public set localViewModel(v: any) {
        this.mLocalViewModel = v;
        this.refreshInherited("localViewModel", (a) => a.mLocalViewModel === undefined);
    }

    public get parent(): AtomControl {
        const ep = AtomBridge.instance.elementParent(this.element);
        if (!ep) {
            return null;
        }
        return AtomBridge.instance.atomParent(ep) as AtomControl;
    }

    public get templateParent(): AtomControl {
        return AtomBridge.instance.templateParent(this.element);
    }

    constructor(e: IAtomElement) {
        super();
        this.element = e;
    }

    public dispose(e?: IAtomElement): void {

        AtomBridge.instance.visitDescendents(e || this.element, (ec, ac) => {
            if (ac) {
                ac.dispose();
                return false;
            }
            return true;
        });

        super.dispose(e);

        if (!e) {
            AtomBridge.instance.dispose(this.element);
        }
    }

    private refreshInherited(name: string, fx: (ac: AtomControl) => boolean): void {
        AtomBinder.refreshValue(this, name);
        AtomBridge.instance.visitDescendents(this.element, (e, ac) => {
            if (ac) {
                if (fx(ac)) {
                    ac.refreshInherited(name, fx);
                }
                return false;
            }
            return true;
        });
    }
}
