import { AtomBinder } from "../../core/AtomBinder";
import { AtomBridge } from "../../core/AtomBridge";
import { AtomComponent } from "../../core/AtomComponent";
import { AtomDispatcher } from "../../core/AtomDispatcher";
import { BindableProperty } from "../../core/BindableProperty";
import { TypeKey } from "../../di/TypeKey";
import { AtomStyle } from "../styles/AtomStyle";
import { AtomStyleClass } from "../styles/AtomStyleClass";
import { AtomStyleSheet } from "../styles/AtomStyleSheet";

// tslint:disable-next-line:interface-name
export interface IAtomControlElement extends HTMLElement {
    atomControl: AtomControl;
    _logicalParent: IAtomControlElement;
    _templateParent: AtomControl;
}

const defaultStyleSheets: { [key: string]: AtomStyle } = {};

/**
 * AtomControl class represents UI Component for a web browser.
 */
export class AtomControl extends AtomComponent<HTMLElement, AtomControl> {

    public defaultControlStyle: any;

    private mControlStyle: AtomStyle = undefined;
    public get controlStyle(): AtomStyle {
        if (this.mControlStyle === undefined) {
            const key = TypeKey.get(this.defaultControlStyle || this.constructor);

            this.mControlStyle = defaultStyleSheets[key];
            if (this.mControlStyle) {
                return this.mControlStyle;
            }

            // let c = Object.getPrototypeOf(this);
            const t = this.theme;
            let c = this.constructor;
            while (c) {
                const style = t.getDefaultStyle(c);
                if (style) {
                    this.mControlStyle = style;
                    break;
                }
                if (this.defaultControlStyle) {
                    break;
                }
                c = Object.getPrototypeOf(c);
            }
            if (this.mControlStyle) {
                defaultStyleSheets[key] = this.mControlStyle;
                return this.mControlStyle;
            }
            if (this.defaultControlStyle) {
                this.mControlStyle = defaultStyleSheets[key];
                if (!this.mControlStyle) {
                    // const pt = Object.getPrototypeOf(this.theme).constructor;
                    // const ss = new (pt)(key);
                    const ss = this.theme;
                    this.mControlStyle = defaultStyleSheets[key] = ss.createNamedStyle(this.defaultControlStyle, key);
                    defaultStyleSheets[key] = this.mControlStyle;
                }
            }
            this.mControlStyle = this.mControlStyle || null;
        }
        return this.mControlStyle;
    }

    public set controlStyle(v: AtomStyle) {
        this.mControlStyle = v;
        AtomBinder.refreshValue(this, "controlStyle");
        this.invalidate();
    }

    private mTheme: AtomStyleSheet;
    private mCachedTheme: AtomStyleSheet;

    /**
     * Represents associated AtomStyleSheet with this visual hierarchy. AtomStyleSheet is
     * inherited by default.
     */
    public get theme(): AtomStyleSheet {
        return this.mTheme ||
            this.mCachedTheme ||
            (this.mCachedTheme = (this.parent ? this.parent.theme : this.app.resolve(AtomStyleSheet, false, null) ));
    }
    public set theme(v: AtomStyleSheet) {
        this.mTheme = v;
        this.refreshInherited("theme", (ac) => ac.mTheme === undefined);
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

    protected preCreate(): void {
        if (!this.element) {
            this.element = document.createElement("div");
        }
    }

    protected setElementValue(element: HTMLElement, name: string, value: any): void {

        if (value === undefined) {
            return;
        }

        if (/^style/.test(name)) {

            if (name.length === 5) {
                element[name] = value;
                return;
            }

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
                    (element as any)._lastClass = s.className;
                } else {
                    element.classList.add(value);
                    (element as any)._lastClass = value;
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
