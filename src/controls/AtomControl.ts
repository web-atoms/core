import { AtomBinder } from "../core/AtomBinder";
import { AtomBridge } from "../core/bridge";
import { ServiceProvider } from "../di/ServiceProvider";
import { AtomStyleClass } from "../styles/AtomStyleClass";
import { AtomTheme } from "../styles/Theme";
import { AtomComponent } from "./AtomComponent";

// tslint:disable-next-line:interface-name
export interface IAtomControlElement extends HTMLElement {
    atomControl: AtomControl;
    _logicalParent: IAtomControlElement;
    _templateParent: AtomControl;
}

export class AtomControl extends AtomComponent<HTMLElement, AtomControl> {

    private mTheme: AtomTheme;
    private mCachedTheme: AtomTheme;
    public get theme(): AtomTheme {
        return this.mTheme ||
            this.mCachedTheme ||
            (this.mCachedTheme = (this.parent ? this.parent.theme : ServiceProvider.global.get(AtomTheme) ));
    }
    public set theme(v: AtomTheme) {
        this.mTheme = v;
        this.refreshInherited("theme", (ac) => ac.mTheme === undefined);
    }

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

    public onPropertyChanged(name: string): void {
        super.onPropertyChanged(name);
        switch (name) {
            case "theme":
                this.mCachedTheme = null;
                AtomBinder.refreshValue(this, "style");
                break;
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

                // this is style class...
                if (name === "class") {
                    const last = (element as any)._lastClass;
                    if (last) {
                        element.classList.remove(last);
                    }

                    if (!value) {
                        return;
                    }

                    const s = value as AtomStyleClass;
                    if (s.className) {
                        element.classList.add(s.className);
                    } else {
                        element.classList.add(value);
                    }
                }

                element.style[name] = value;
                return;
            }

            if (/^event/.test(name)) {
                name = name.substr(5);
                name = name.charAt(0).toLowerCase() + name.substr(1);
                // element.style[name] = value;
                this.bindEvent(element, name, (...e: any[]) => {
                    try {
                        const f = value as (...v: any[]) => any;
                        const pr = f.apply(this, e) as Promise<any>;
                        if (pr && pr.catch && pr.then) {
                            pr.catch((error) => {
                                if (/cancelled/i.test(error)) {
                                    // tslint:disable-next-line:no-console
                                    console.warn(error);
                                    return;
                                }
                                // tslint:disable-next-line:no-console
                                console.error(error);
                            });
                        }
                    } catch (er1) {
                        // tslint:disable-next-line:no-console
                        console.error(er1);
                    }
                });
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

    protected removeAllChildren(e: HTMLElement): void {
        let child = e.firstElementChild as HTMLElement;
        while (child) {
            const c = child;
            child = child.nextElementSibling as HTMLElement;
            const ac = c as IAtomControlElement;
            if (ac && ac.atomControl) {
                ac.atomControl.dispose();
            } else {
                // remove all children events
                this.unbindEvent(child);
                // remove all bindings
                this.unbind(child);
            }
            c.remove();
        }
    }

}
