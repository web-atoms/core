import { App } from "../../App";
import { AtomBinder } from "../../core/AtomBinder";
import { AtomBridge, AtomElementBridge } from "../../core/AtomBridge";
import { AtomComponent } from "../../core/AtomComponent";
import { AtomDispatcher } from "../../core/AtomDispatcher";
import FormattedString from "../../core/FormattedString";
import WebImage from "../../core/WebImage";
import { isControl } from "../../core/XNode";
import { TypeKey } from "../../di/TypeKey";
import { NavigationService } from "../../services/NavigationService";
import { AtomStyle } from "../styles/AtomStyle";
import { AtomStyleSheet } from "../styles/AtomStyleSheet";

const isAtomControl = isControl;

// export { default as WebApp } from "../WebApp";

// if (!AtomBridge.platform) {
//     AtomBridge.platform = "web";
//     AtomBridge.instance = new AtomElementBridge();
// } else {
//     console.log(`Platform is ${AtomBridge.platform}`);
// }

declare var bridge;
if (typeof bridge !== "undefined" && bridge.platform) {
    throw new Error("AtomControl of Web should not be used with Xamarin Forms");
}

const bridgeInstance = AtomBridge.instance;

declare global {
    // tslint:disable-next-line:interface-name
    export interface HTMLElement {
        atomControl: AtomControl;
        _logicalParent: HTMLElement;
        _templateParent: AtomControl;
    }
}

const defaultStyleSheets: { [key: string]: AtomStyle } = {};

/**
 * AtomControl class represents UI Component for a web browser.
 */

export class AtomControl extends AtomComponent<HTMLElement, AtomControl> {

    public defaultControlStyle: any;

    private mControlStyle: AtomStyle;
    public get controlStyle(): AtomStyle {
        if (this.mControlStyle === undefined) {
            const key = TypeKey.get(this.defaultControlStyle || this.constructor);

            this.mControlStyle = defaultStyleSheets[key];
            if (this.mControlStyle) {
                return this.mControlStyle;
            }

            if (this.defaultControlStyle) {
                this.mControlStyle = defaultStyleSheets[key] ||
                ( defaultStyleSheets[key] = this.theme.createNamedStyle(this.defaultControlStyle, key));
            }
            this.mControlStyle = this.mControlStyle || null;
        }
        return this.mControlStyle;
    }

    public set controlStyle(v: AtomStyle) {
        if (v instanceof AtomStyle) {
            this.mControlStyle = v;
        } else {
            const key = TypeKey.get(v);
            this.mControlStyle = defaultStyleSheets[key] ||
            ( defaultStyleSheets[key] = this.theme.createNamedStyle(v, key));
        }
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
        bridgeInstance.refreshInherited(this, "theme");
    }

    /**
     * Gets Parent AtomControl of this control.
     */
    public get parent(): AtomControl {
        let e = this.element._logicalParent || this.element.parentElement;
        if (!e) {
            return null;
        }
        while (e) {
            const ac = e.atomControl;
            if (ac) {
                return ac;
            }
            e = e._logicalParent || e.parentElement;
        }
    }

    protected get factory() {
        return AtomControl;
    }

    constructor(app: App, e?: HTMLElement) {
        super(app, e || document.createElement("div"));
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
        while (e) {
            const ac = e.atomControl;
            if (ac) {
                return ac;
            }
            e = e._logicalParent ?? e.parentElement;
        }
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
        bridgeInstance.visitDescendents(this.element, (e, ac) => {
            if (ac) {
                ac.updateSize();
                return false;
            }
            return true;
        });
    }

    protected preCreate(): void {
        // if (!this.element) {
        //     this.element = document.createElement("div");
        // }
    }

    protected setElementValue(element: HTMLElement, name: string, value: any): void {

        if (value === undefined) {
            return;
        }

        if (/^style/.test(name)) {

            if (name.length === 5) {
                element.setAttribute("style", value);
                return;
            }

            name = name.substr(5);
            name = name.charAt(0).toLowerCase() + name.substr(1);

            // this is style class...
            if (name === "class") {
                this.setElementClass(element, value);
                return;
            }
            if (value instanceof WebImage) {
                value = `url(${value})`;
            }
            element.style[name] = value;
            return;
        }

        if (/^event/.test(name)) {
            name = name.substr(5);
            name = name.charAt(0).toLowerCase() + name.substr(1);

            this.bindEvent(element, name, async (...e: any[]) => {
                try {
                    const f = value as (...v: any[]) => any;
                    const pr = f.apply(this, e) as Promise<any>;
                    if (pr) {
                        try {
                            await pr;
                        } catch (error) {
                            if (/canceled|cancelled/i.test(error)) {
                                return;
                            }

                            const nav: NavigationService = this.app.resolve(NavigationService);
                            await nav.alert(error, "Error");
                        }
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
            case "formattedText":
                if (value instanceof FormattedString) {
                    (value as FormattedString).applyTo(this.app, element);
                } else {
                    element.textContent = (value || "").toString();
                }
                break;
            case "class":
                this.setElementClass(element, value, true);
                break;
            case "autofocus":
                this.app.callLater(() => {
                    const ie = element as HTMLInputElement;
                    if (ie) { ie.focus(); }
                });
            case "src":
                if (value && /^http\:/i.test(value)) {
                    (element as any).src = value.substr(5);
                } else {
                    (element as any).src = value;
                }
                break;
            default:
                element[name] = value;
        }
    }

    protected setElementClass(element: HTMLElement, value: any, clear?: boolean): void {
        const s = value;
        if (s && typeof s === "object") {
            if (!s.className) {
                if (clear) {
                    let sr = "";
                    for (const key in s) {
                        if (s.hasOwnProperty(key)) {
                            const sv = s[key];
                            if (sv) {
                                sr += (sr ? (" " + key) : key);
                            }
                        }
                    }
                    element.className = sr;
                    return;
                }
                for (const key in s) {
                    if (s.hasOwnProperty(key)) {
                        const sv = s[key];
                        if (sv) {
                            if (!element.classList.contains(key)) {
                                element.classList.add(key);
                            }
                        } else {
                            if (element.classList.contains(key)) {
                                element.classList.remove(key);
                            }
                        }
                    }
                }
                return;
            }
        }
        const sv1 = s ? (s.className || s.toString()) : "";
        element.className = sv1;
    }

    protected onUpdateSize(): void {
        // pending !!
    }

    protected removeAllChildren(e: HTMLElement): void {
        let child = e.firstElementChild as HTMLElement;
        while (child) {
            const c = child;
            child = child.nextElementSibling as HTMLElement;
            const ac = c;
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

    protected createNode(app, e, iterator, creator) {
        const name = iterator.name;
        const attributes = iterator.attributes;
        if (typeof name === "string") {
            const element = document.createElement(name);
            e?.appendChild(element);
            this.render(iterator, element, creator);
            return element;
        }

        if (name[isAtomControl]) {
            const forName = attributes?.for;
            const ctrl = new (name)(app,
                forName ? document.createElement(forName) : undefined);
            const element = ctrl.element ;
            e?.appendChild(element);
            ctrl.render(iterator, element, creator);
            return element;
        }

        throw new Error(`not implemented create for ${iterator.name}`);
    }

    protected toTemplate(app, iterator, creator) {
        const name = iterator.name;
        if (typeof name === "string") {
            return class Template extends AtomControl {
                constructor(a, e) {
                    super(a ?? app, e ?? document.createElement(name));
                }

                public create() {
                    super.create();
                    this.render(iterator, null, creator);
                }
            };
        }

        if (name[isAtomControl]) {
            return class Template extends (name as any) {
                constructor(a, e) {
                    super(a ?? app, e ?? document.createElement(name));
                }

                public create() {
                    super.create();
                    this.render(iterator, null, creator);
                }
            };
        }

        throw new Error(`Creating template from ${name} not supported`);

    }
}

bridgeInstance.controlFactory = AtomControl;
