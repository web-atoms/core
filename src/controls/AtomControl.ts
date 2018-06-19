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

/**
 * AtomControl class represents UI Component for a web browser.
 */
export class AtomControl extends AtomComponent<HTMLElement, AtomControl> {

    private mTheme: AtomTheme;
    private mCachedTheme: AtomTheme;

    /**
     * Represents associated AtomTheme with this visual hierarchy. AtomTheme is
     * inherited by default.
     */
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

    /**
     * Gets Parent AtomControl of this control.
     */
    public get parent(): AtomControl {
        const ep = (this.element as IAtomControlElement)._logicalParent || this.element.parentElement;
        if (!ep) {
            return null;
        }
        return this.atomParent(ep);
    }

    /**
     * Gets Template Parent, from where the current template was loaded.
     */
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

    /**
     * Use this method if you want to set attribute on HTMLElement immediately but
     * defer atom control property
     * @param element HTMLElement
     * @param name string
     * @param value any
     */
    public setPrimitiveValue(element: HTMLElement, name: string, value: any): void {
        const p = value as Promise<any>;
        if (p && p.then && p.catch) {
            p.then( (r) => {
                this.setPrimitiveValue(element, name, r);
            }).catch((e) => {
                // tslint:disable-next-line:no-console
                console.error(e);
            });
            return;
        }
        if ((!element || element === this.element) &&  this.hasProperty(name)) {
            this.runAfterInit(() => {
                this[name] = value;
            });
        } else {
            this.setElementValue(element, name, value);
        }
    }

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
            this.setElementValue(element, name, value);
        }
    }

    public updateSize(): void {
        this.onUpdateSize();
        AtomBridge.instance.visitDescendents(this.element, (e, ac) => {
            if (ac) {
                ac.updateSize();
                return false;
            }
            return true;
        });
    }

    protected setElementValue(element: HTMLElement, name: string, value: any): void {
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

    protected onUpdateSize(): void {
        // pending !!
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
