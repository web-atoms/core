import { AtomBinder } from "../core/AtomBinder";
import { AtomBridge } from "../core/bridge";
import { AtomComponent } from "./AtomComponent";

// tslint:disable-next-line:interface-name
export interface IAtomControlElement extends HTMLElement {
    atomControl: AtomControl;
    _logicalParent: IAtomControlElement;
    _templateParent: AtomControl;
}

export class AtomControl extends AtomComponent<HTMLElement, AtomControl> {

    constructor(e?: HTMLElement) {
        super(e);
    }

    public get parent(): AtomControl {
        const ep = (this.element as IAtomControlElement)._logicalParent || this.element.parentElement;
        if (!ep) {
            return null;
        }
        return this.atomParent(ep);
    }

    public get templateParent(): AtomControl {
        let e = this.element as IAtomControlElement;
        while (e) {
            const tp = e._templateParent;
            if (tp) {
                return tp;
            }
            e = e._logicalParent || e.parentElement as IAtomControlElement;
        }
    }

    public atomParent(e: HTMLElement): AtomControl {
        const ep = this.element as IAtomControlElement;
        if (ep.atomControl) {
            return ep.atomControl;
        }
        return this.atomParent(ep.parentElement as HTMLElement);
    }

    public attachControl(): void {
        (this.element as IAtomControlElement).atomControl = this;
    }

    public append(element: AtomControl | HTMLElement): AtomControl {
        if (element instanceof AtomControl) {
            this.element.appendChild(element.element);
        } else {
            this.element.appendChild(element);
        }
        return this;
    }

    protected refreshInherited(name: string, fx: (ac: AtomControl) => boolean): void {
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
