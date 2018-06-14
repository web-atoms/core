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
        if (!e) {
            return;
        }
        const ep = e as IAtomControlElement;
        if (ep.atomControl) {
            return ep.atomControl;
        }
        return this.atomParent(ep._logicalParent || ep.parentElement as HTMLElement);
    }

    public attachControl(): void {
        (this.element as IAtomControlElement).atomControl = this;
    }

    public append(element: AtomControl | HTMLElement | Text): AtomControl {
        if (element instanceof AtomControl) {
            this.element.appendChild(element.element);
        } else {
            this.element.appendChild(element);
        }
        return this;
    }

    // public init(): void {
    //     const a = this.pendingInits;
    //     this.pendingInits = null;
    //     if (a) {
    //         for (const iterator of a) {
    //             iterator();
    //         }
    //     }
    //     this.pendingInits = null;
    //     AtomBridge.instance.visitDescendents(this.element, (e, ac) => {
    //         if (ac) {
    //             ac.init();
    //             return false;
    //         }
    //         return true;
    //     });
    // }

    public setLocalValue(element: HTMLElement, name: string, value: any): void {

        // if value is a promise
        const p = value as Promise<any>;
        if (p && p.then && p.catch) {
            p.then( (r) => {
                this.setLocalValue(element, name, r);
            }).catch((e) => {
                // tslint:disable-next-line:no-console
                console.error(e);
            });
            return;
        }

        if ((!element || element === this.element) &&  this.hasProperty(name)) {
            this[name] = value;
        } else {
            // AtomBridge.instance.setValue(element, name, value);

            if (/^style/.test(name)) {
                name = name.substr(5);
                name = name.charAt(0).toLowerCase() + name.substr(1);
                element.style[name] = value;
                return;
            }

            if (/^event/.test(name)) {
                name = name.substr(5);
                name = name.charAt(0).toLowerCase() + name.substr(1);
                // element.style[name] = value;
                this.bindEvent(element, name, value);
                return;
            }

            switch (name) {
                case "text":
                    element.textContent = value;
                    break;
                default:
                    element[name] = value;
            }
        }
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
