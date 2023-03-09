import { App } from "../../App";
import { AtomBinder } from "../../core/AtomBinder";
import { AtomBridge, AtomElementBridge } from "../../core/AtomBridge";
import { AtomComponent } from "../../core/AtomComponent";
import { AtomDispatcher } from "../../core/AtomDispatcher";
import { BindableProperty } from "../../core/BindableProperty";
import FormattedString from "../../core/FormattedString";
import WebImage from "../../core/WebImage";
import XNode, { elementFactorySymbol, isControl } from "../../core/XNode";
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
        (ctrl as any).bindEvent(e, name, value);
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

function disposeChildren(owner: AtomControl, e: HTMLElement) {
    if (!e) {
        return;
    }
    let s = e.firstElementChild;
    while (s) {
        const c = s as HTMLElement;
        s = s.nextElementSibling as HTMLElement;
        const ac = c.atomControl;
        if (ac) {
            ac.dispose();
            c.remove();
            continue;
        }
        disposeChildren(owner, c);
        owner.unbind(c);
        owner.unbindEvent(c);
        c.remove();
    }
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
    },
    ariaLabel(ctrl: AtomControl, e: HTMLElement, value) {
        if (value === null) {
            e.removeAttribute("aria-label");
            return;
        }
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        if (typeof value !== "string") {
            value = value.toString();
        }
        e.setAttribute("aria-label", value);
    },
    ariaPlaceholder(ctrl: AtomControl, e: HTMLElement, value) {
        if (value === null) {
            e.removeAttribute("aria-placeholder");
            return;
        }
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        if (typeof value !== "string") {
            value = value.toString();
        }
        e.setAttribute("aria-placeholder", value);
    }
};

ElementValueSetters["aria-label"] = ElementValueSetters.ariaLabel;
ElementValueSetters["aria-placeholder"] = ElementValueSetters.ariaPlaceholder;
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

export type PropertyRegistration = ((value) => ({[key: string]: any})) & {
    property: string;
};


/**
 * AtomControl class represents UI Component for a web browser.
 */
export class AtomControl extends AtomComponent<HTMLElement, AtomControl> {

    public static from<T = AtomControl>(e1: Element | EventTarget): T {
        let e = e1 as any;
        while (e) {
            const { atomControl } = e;
            if (atomControl) {
                return atomControl as T;
            }
            e = e._logicalParent ?? e.parentElement;
        }
    }

    public static registerProperty(
        attributeName: string,
        attributeValue: string,
        setter: (ctrl: AtomControl, element: HTMLElement, value: any) => void): PropertyRegistration {
        const setterSymbol = `${attributeName}_${attributeValue}_${propertyId++}`;
        ElementValueSetters[setterSymbol] = setter;
        function setterFx(v) {
            return {
                [setterSymbol]: v
            };
        }
        setterFx.toString = () => {
            return setterSymbol;
        };
        setterFx.property = setterSymbol;
        return setterFx;
    }

    @BindableProperty
    public renderer: XNode;

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

    constructor(app: App, e: HTMLElement = document.createElement("div")) {
        super(app, e);
    }

    public onPropertyChanged(name: string): void {
        super.onPropertyChanged(name);
        switch (name) {
            case "theme":
                this.mCachedTheme = null;
                AtomBinder.refreshValue(this, "style");
                break;
            case "renderer":
                this.rendererChanged();
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

    protected rendererChanged() {
        disposeChildren(this, this.element);
        this.element.innerHTML = "";
        const r = this.renderer;
        if (!r) {
            return;
        }
        delete this.render;
        this.render(r);
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

        const setter = ElementValueSetters[name];
        if (setter !== void 0) {
            setter(this, element, value);
            return;
        }

        if (/^(data|aria)\-/.test(name)) {
            if (value === null) {
                element.removeAttribute(name);
                return;
            }
            if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            if (typeof value !== "string") {
                value = value.toString();
            }
            element.setAttribute(name, value);
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

            this.bindEvent(element, name, value);
            return;
        }

        if (name.startsWith("aria-")) {
            element.setAttribute(name, value);
        } else {
            element[name] = value;
        }
    }

    // protected bindElementEvent(element: HTMLElement, name: string, value: any) {
    //     this.bindEvent(element, name, value);
    // }

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

        if (iterator.isTemplate) {
            return this.toTemplate(app, iterator.children[0], creator);
        }

        const name = iterator.name;
        if (typeof name === "string") {
            return class Template extends AtomControl {
                constructor(a = app, e = document.createElement(name)) {
                    super(a, e);
                }

                public create() {
                    super.create();
                    this.render(iterator, undefined, creator);
                }
            };
        }

        if (name[isAtomControl]) {

            const forName = name.attributes?.for;

            if (forName) {
                return class Template extends (name as any) {
                    constructor(a = app, e = document.createElement(forName)) {
                        super(a, e);
                    }

                    public create() {
                        super.create();
                        this.render(iterator, undefined, creator);
                    }
                };
            }

            return class Template extends (name as any) {
                constructor(a = app, e) {
                    super(a, e);
                }

                public create() {
                    super.create();
                    this.render(iterator, undefined, creator);
                }
            };
        }

        throw new Error(`Creating template from ${name} not supported`);

    }

    protected dispatchClickEvent(e: MouseEvent, data: any) {
        let clickEvent = data.clickEvent;
        if (!clickEvent) {
            return;
        }
        clickEvent = clickEvent.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        const ce = new CustomEvent(clickEvent, { detail: data, bubbles: true, cancelable: true });
        e.target.dispatchEvent(ce);
        if ((ce as any).preventClickEvent) {
            // ce.preventDefault();
            e.preventDefault();
        }

        /** There is a problem with following method, in hierarchy of nodes,
         * it will not be possible to know which control should execute it
         */

        // if (!ce.defaultPrevented) {
        //     if (clickEvent === "invokeMethod") {
        //         const method = data.method;
        //         const m = this[method] as Function;
        //         if (m) {
        //             this.app.runAsync(() => m.call(this, ce));
        //         }

        //     }
        // }
    }
}

document.body.addEventListener("click", (e) => {
    if (e.defaultPrevented) {
        return;
    }
    const originalTarget = e.target as HTMLElement;
    let control = AtomControl.from(originalTarget);
    if (control !== void 0) {
        const data = new Proxy(originalTarget, {
            get(target, p) {
                if (typeof p !== "string") {
                    return;
                }
                while (target) {
                    const value = target.dataset[p];
                    if (value !== void 0) {
                        return value;
                    }
                    target = target.parentElement;
                }
            }
        });
        // @ts-ignore
        control.dispatchClickEvent(e, data);
    }
});

bridgeInstance.controlFactory = AtomControl;
