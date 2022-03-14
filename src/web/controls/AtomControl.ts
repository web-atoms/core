import { App } from "../../App";
import { AtomBinder } from "../../core/AtomBinder";
import { AtomBridge, AtomElementBridge } from "../../core/AtomBridge";
import { AtomComponent } from "../../core/AtomComponent";
import { AtomDispatcher } from "../../core/AtomDispatcher";
import FormattedString from "../../core/FormattedString";
import WebImage from "../../core/WebImage";
import { elementFactorySymbol, isControl } from "../../core/XNode";
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

const fromHyphenToCamel = (input: string) => input.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

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

function setAttribute(name: string) {
    return (ctrl: AtomControl, e: HTMLElement, value: any) => {
        e.setAttribute(name, value);
    };
}

function setEvent(name: string) {
    return (ctrl: AtomControl, e: HTMLElement, value: any) => {
        (ctrl as any).bindElementEvent(e, name, value);
    };
}

function setStyle(name: string, applyUnit?: string) {
    if (applyUnit) {
        return (ctrl: AtomControl, e: HTMLElement, value: any) => {
            if (typeof value === "number") {
                e.style[name] = value + applyUnit;
                return;
            }
            e.style[name] = value;
        };
    }
    return (ctrl: AtomControl, e: HTMLElement, value: any) => {
        e.style[name] = value;
    };
}

export interface ISetters {
    // tslint:disable-next-line: ban-types
    [key: string | symbol]: (ctrl: AtomControl, e: HTMLElement, value: any) => void;
}

export const ElementValueSetters: ISetters = {
    text(ctrl: AtomControl, e: HTMLElement, value: any) {
        e.textContent = value;
    },
    ["class"](ctrl: AtomControl, e: HTMLElement, value: any) {
        if (typeof value === "string") {
            e.className = value;
            return;
        }
        (ctrl as any).setElementClass(e, value, true);
    },
    alt: setAttribute("alt"),
    title: setAttribute("title"),
    href: setAttribute("href"),
    target: setAttribute("target"),
    style: setAttribute("style"),
    styleLeft: setStyle("left", "px"),
    styleTop: setStyle("top", "px"),
    styleBottom: setStyle("bottom", "px"),
    styleRight: setStyle("right", "px"),
    styleWidth: setStyle("width", "px"),
    styleHeight: setStyle("height", "px"),
    stylePosition: setStyle("position"),
    styleFontSize: setStyle("fontSize", "px"),
    styleFontFamily: setStyle("fontFamily"),
    styleFontWeight: setStyle("fontWeight"),
    styleBorder: setStyle("border"),
    styleBorderWidth: setStyle("borderWidth", "px"),
    styleBorderColor: setStyle("borderColor"),
    styleColor: setStyle("color"),
    styleBackgroundColor: setStyle("backgroundColor"),
    dir: setAttribute("dir"),
    name: setAttribute("name"),
    tabIndex: setAttribute("tabIndex"),
    contentEditable: setAttribute("contentEditable"),
    eventClick: setEvent("click"),
    eventKeydown: setEvent("keydown"),
    eventKeyup: setEvent("keyup"),
    eventKeypress: setEvent("keypress"),
    eventMousedown: setEvent("mousedown"),
    eventMouseup: setEvent("mouseup"),
    eventMousemove: setEvent("mousemove"),

    src(ctrl: AtomControl, e: any, value: any) {
        if (value && /^http\:/i.test(value)) {
            e.src = value.substring(5);
            return;
        }
        e.src = value;
    },
    styleClass(ctrl: any, e: any, value: any) {
        ctrl.setElementClass(e, value);
    },
    styleDisplay(ctrl: AtomControl, e: HTMLElement, value) {
        if (typeof value === "boolean") {
            e.style.display = value ? "" : "none";
            return;
        }
        e.style.display = value;
    },
    formattedText(ctrl: AtomControl, e: HTMLElement, value) {
        if (value instanceof FormattedString) {
            (value as FormattedString).applyTo(ctrl.app, e);
        } else {
            e.textContent = (value || "").toString();
        }
    },
    disabled(ctrl: AtomControl, e: HTMLElement, value) {
        if (value) {
            e.setAttribute("disabled", "");
            return;
        }
        e.removeAttribute("disabled");
    },
    autofocus(ctrl: AtomControl, element: HTMLElement, value) {
        ctrl.app.callLater(() => {
            const ie = element as HTMLInputElement;
            if (ie) { ie.focus(); }
        });
    },
    autocomplete(ctrl: AtomControl, element: HTMLElement, value) {
        ctrl.app.callLater(() => {
            (element as HTMLInputElement).autocomplete = value;
        });
    },
    onCreate(ctrl: AtomControl, element: HTMLElement, value) {
        value(ctrl, element);
    },
    watch(ctrl: AtomControl, element: HTMLElement, value) {
        setTimeout((c1: AtomControl, e1: HTMLElement, v1: any) => {
            e1.dispatchEvent(new CustomEvent("watch", {
                bubbles: true,
                cancelable: true,
                detail: {
                    control: c1,
                    value: v1
                }
            }));
        }, 1, ctrl, element, value);
    }
};

ElementValueSetters["style-display"] = ElementValueSetters.styleDisplay;
ElementValueSetters["style-left"] = ElementValueSetters.styleLeft;
ElementValueSetters["style-top"] = ElementValueSetters.styleTop;
ElementValueSetters["style-bottom"] = ElementValueSetters.styleBottom;
ElementValueSetters["style-right"] = ElementValueSetters.styleRight;
ElementValueSetters["style-width"] = ElementValueSetters.styleWidth;
ElementValueSetters["style-height"] = ElementValueSetters.styleHeight;
ElementValueSetters["style-position"] = ElementValueSetters.stylePosition;
ElementValueSetters["style-font-size"] = ElementValueSetters.styleFontSize;
ElementValueSetters["style-font-family"] = ElementValueSetters.styleFontFamily;
ElementValueSetters["style-font-weight"] = ElementValueSetters.styleFontWeight;
ElementValueSetters["style-border"] = ElementValueSetters.styleBorder;
ElementValueSetters["style-border-width"] = ElementValueSetters.styleBorderWidth;
ElementValueSetters["style-border-color"] = ElementValueSetters.styleBorderColor;
ElementValueSetters["style-color"] = ElementValueSetters.styleColor;
ElementValueSetters["style-background-color"] = ElementValueSetters.styleBackgroundColor;
ElementValueSetters["on-create"] = ElementValueSetters.onCreate;

let propertyId = 1;

/**
 * AtomControl class represents UI Component for a web browser.
 */
export class AtomControl extends AtomComponent<HTMLElement, AtomControl> {

    public static registerProperty(
        attributeName: string,
        attributeValue: string,
        setter: (ctrl: AtomControl, element: HTMLElement, value: any) => void) {
        const setterSymbol = `${attributeName}_${attributeValue}_${propertyId++}`;
        ElementValueSetters[setterSymbol] = setter;
        return setterSymbol;
    }

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

        // switch (name) {
        //     case "text":
        //         element.textContent = value;
        //         return;
        //     case "class":
        //         this.setElementClass(element, value, true);
        //         return;
        //     case "alt":
        //         (element as any).alt = value;
        //         return;
        //     case "src":
        //         if (value && /^http\:/i.test(value)) {
        //             (element as any).src = value.substr(5);
        //         } else {
        //             (element as any).src = value;
        //         }
        //         return;
        //     case "styleClass":
        //         this.setElementClass(element, value);
        //         return;
        //     case "styleDisplay":
        //         if (typeof value === "boolean") {
        //             element.style.display = value ? "" : "none";
        //         } else {
        //             element.style.display = value;
        //         }
        //         return;
        //     case "title":
        //         element.title = value;
        //         return;
        //     case "formattedText":
        //         if (value instanceof FormattedString) {
        //             (value as FormattedString).applyTo(this.app, element);
        //         } else {
        //             element.textContent = (value || "").toString();
        //         }
        //         return;
        //     case "disabled":
        //         if (value) {
        //             element.setAttribute("disabled", "");
        //         } else {
        //             element.removeAttribute("disabled");
        //         }
        //         return;
        //     case "autofocus":
        //         this.app.callLater(() => {
        //             const ie = element as HTMLInputElement;
        //             if (ie) { ie.focus(); }
        //         });
        //     case "style":
        //         element.setAttribute("style", value);
        //         return;
        //     case "eventClick":
        //         this.bindElementEvent(element, "click", value);
        //         return;
        //     case "eventKeydown":
        //         this.bindElementEvent(element, "keydown", value);
        //         return;
        //     case "eventKeypress":
        //         this.bindElementEvent(element, "keypress", value);
        //         return;
        //     case "eventKeyup":
        //         this.bindElementEvent(element, "keyup", value);
        //         return;
        // }

        const setter = ElementValueSetters[name];
        if (setter !== void 0) {
            setter(this, element, value);
            return;
        }

        if (/^data\-/.test(name)) {
            name = fromHyphenToCamel(name.substring(5));
            if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            element.dataset[name] = value;
            return;
        }

        if (/^style/.test(name)) {
            name = name.substring(5);
            if (name.startsWith("-")) {
                name = fromHyphenToCamel(name.substring(1));
            } else {
                name = name.charAt(0).toLowerCase() + name.substring(1);
            }

            if (value instanceof WebImage) {
                value = `url(${value})`;
            }
            element.style[name] = value;
            return;
        }

        if (/^event/.test(name)) {
            name = name.substring(5);
            if (name.startsWith("-")) {
                name = fromHyphenToCamel(name.substring(1));
            } else {
                name = name.charAt(0).toLowerCase() + name.substring(1);
            }

            this.bindElementEvent(element, name, value);
            return;
        }

        element[name] = value;
    }

    protected bindElementEvent(element: HTMLElement, name: string, value: any) {
        this.bindEvent(element, name, async (...e: any[]) => {
            try {
                const f = value as (...v: any[]) => any;
                const pr = f.apply(this, e) as Promise<any>;
                if (pr?.then) {
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
            if (name === "input") {
                if (!attributes.autocomplete) {
                    this.app.callLater(() => {
                        (element as HTMLInputElement).autocomplete = "google-stop";
                    });
                }
            }
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

            const forName = name.attributes?.for;

            if (forName) {
                return class Template extends (name as any) {
                    constructor(a, e) {
                        super(a ?? app, e ?? document.createElement(forName));
                    }

                    public create() {
                        super.create();
                        this.render(iterator, null, creator);
                    }
                };
            }

            return class Template extends (name as any) {
                constructor(a, e) {
                    super(a ?? app, e);
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
