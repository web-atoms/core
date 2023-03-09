import { App } from "../App";
import { AtomBridge } from "../core/AtomBridge";
import { ArrayHelper, CancelToken, IAnyInstanceType, IAtomElement,
    IDisposable, ignoreValue, INotifyPropertyChanged, PathList } from "../core/types";
import { Inject } from "../di/Inject";
import { TypeKey } from "../di/TypeKey";
import { NavigationService } from "../services/NavigationService";
import { AtomStyle } from "../web/styles/AtomStyle";
import { AtomStyleSheet } from "../web/styles/AtomStyleSheet";
import { AtomBinder } from "./AtomBinder";
import { AtomDisposableList } from "./AtomDisposableList";
import { AtomOnce } from "./AtomOnce";
import { AtomWatcher, ObjectProperty } from "./AtomWatcher";
import Bind, { bindSymbol } from "./Bind";
import { BindableProperty } from "./BindableProperty";
import FormattedString from "./FormattedString";
import { InheritedProperty } from "./InheritedProperty";
import { IValueConverter } from "./IValueConverter";
import { PropertyMap } from "./PropertyMap";
import WebImage from "./WebImage";
import XNode, { attachedSymbol, constructorNeedsArgumentsSymbol,
    elementFactorySymbol, IElementAttributes, isControl, isFactorySymbol, xnodeSymbol } from "./XNode";

const isAtomControl = isControl;

const fromHyphenToCamel = (input: string) => input.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

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

interface IEventObject {

    element: HTMLElement;

    name?: string;

    handler?: EventListenerOrEventListenerObject;

    key?: string;

    disposable?: IDisposable;

}

export interface IAtomComponent {
    element: HTMLElement;
    data: any;
    viewModel: any;
    localViewModel: any;
    app: App;
    setLocalValue(e: HTMLElement, name: string, value: any): void;
    hasProperty(name: string);
    runAfterInit(f: () => void ): void;
}

const objectHasOwnProperty = Object.prototype.hasOwnProperty;

const localBindSymbol = bindSymbol;
const localXNodeSymbol = xnodeSymbol;

export class AtomControl implements
    INotifyPropertyChanged {

    public static readonly [isControl] = true;

    public static readonly [isFactorySymbol] = true;

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

    // public element: HTMLElement;
    public readonly disposables: AtomDisposableList;

    public readonly element: HTMLElement;

    @InheritedProperty
    public data: any;

    @InheritedProperty
    public viewModel: any;

    @InheritedProperty
    public localViewModel: any;

    @BindableProperty
    public renderer: XNode;

    public defaultControlStyle: any;

    protected pendingInits: Array<() => void>;

    private mInvalidated: any = 0;

    private mPendingPromises: { [key: string]: Promise<any> } = {};

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

    /** Do not ever use, only available as intellisense feature for
     * vs code editor.
     */
    public get vsProps(): { [k in keyof this]?: this[k]} | IElementAttributes {
        return undefined;
    }

    // public abstract get templateParent(): TC;
    // {
    //     return AtomBridge.instance.templateParent(this.element);
    // }

    private readonly eventHandlers: IEventObject[];

    private readonly bindings: Array<PropertyBinding<HTMLElement>>;

    private mTheme: AtomStyleSheet;
    private mCachedTheme: AtomStyleSheet;

    constructor(
        @Inject public readonly app: App,
        element: HTMLElement = null) {
        this.disposables = new AtomDisposableList();
        this.bindings = [];
        this.eventHandlers = [];
        this.element = element as any;
        // AtomBridge.instance.attachControl(this.element, this as any);
        (this.element as any).atomControl = this;
        const a = this.beginEdit();
        this.preCreate();
        this.create();
        app.callLater(() => a.dispose());
    }

    public atomParent(e: HTMLElement) {
        while (e) {
            const ac = e.atomControl;
            if (ac) {
                return ac;
            }
            e = e._logicalParent ?? e.parentElement;
        }
    }

    public bind(
        element: HTMLElement,
        name: string,
        path: PathList[],
        twoWays?: boolean | string[],
        valueFunc?: (...v: any[]) => any,
        source?: any): IDisposable {

        // remove existing binding if any
        // let binding = this.bindings.find( (x) => x.name === name && (element ? x.element === element : true));
        // if (binding) {
        //     binding.dispose();
        //     ArrayHelper.remove(this.bindings, (x) => x === binding);
        // }
        const binding = new PropertyBinding(this, element, name, path, twoWays, valueFunc, source);
        this.bindings.push(binding);

        return {
            dispose: () => {
                binding.dispose();
                ArrayHelper.remove(this.bindings, (x) => x === binding);
            }
        };
    }

    /**
     * Remove all bindings associated with given element and optional name
     * @param element HTMLElement
     * @param name string
     */
    public unbind(element: HTMLElement, name?: string): void {
        const toDelete = this.bindings.filter( (x) => x.element === element && (!name || (x.name === name)));
        for (const iterator of toDelete) {
            iterator.dispose();
            ArrayHelper.remove(this.bindings, (x) => x === iterator);
        }
    }

    public bindEvent(
        element: HTMLElement,
        name?: string,
        method?: EventListenerOrEventListenerObject,
        key?: string,
        capture?: boolean | AddEventListenerOptions): IDisposable {
        if (!element) {
            return;
        }
        if (!method) {
            return;
        }
        const be: IEventObject<HTMLElement> = {
            element,
            name,
            handler: method
        };
        if (key) {
            be.key = key;
        }
        const handler = (e) => {
            try {
                const r = (method as any)(e);
                e.executed = true;
                e.promise = e.promise ? Promise.all([r, e.promise]) : r;
                if (r?.catch) {
                    return r.catch((c) => {
                        if (CancelToken.isCancelled(c ?? "Unknown error")) {
                            return;
                        }
                        alert(c.stack ?? c);
                    });
                }
                return r;
            } catch (error) {
                if (CancelToken.isCancelled(error)) {
                    return;
                }
                alert(error.stack ?? error);
            }
        };
        element.addEventListener(name as any, handler, capture as any);
        be.disposable = {
            dispose: () => {
                element.removeEventListener(name as any, handler, capture as any);
                be.disposable.dispose = () => undefined;
            }
        };
        this.eventHandlers.push(be);

        return {
            dispose: () => {
                be.disposable.dispose();
                ArrayHelper.remove(this.eventHandlers, (e) => e.disposable === be.disposable);
            }
        };
    }

    public unbindEvent(
        element: HTMLElement,
        name?: string,
        method?: EventListenerOrEventListenerObject,
        key?: string): void {
        const deleted: Array<(() => void)> = [];
        for (const be of this.eventHandlers) {
            if (element && be.element !== element) {
                return;
            }
            if (key && be.key !== key) {
                return;
            }
            if (name && be.name !== name) {
                return;
            }
            if (method && be.handler !== method) {
                return;
            }
            be.disposable.dispose();
            be.handler = null;
            be.element = null;
            be.name = null;
            be.key = null;
            deleted.push(() => this.eventHandlers.remove(be));
        }
        for (const iterator of deleted) {
            iterator();
        }
    }

    /**
     * Control checks if property is declared on the control or not.
     * Since TypeScript no longer creates enumerable properties, we have
     * to inspect name and PropertyMap which is generated by `@BindableProperty`
     * or the value is not set to undefined.
     * @param name name of Property
     */
    public hasProperty(name: string): boolean {
        if (/^(data|viewModel|localViewModel|element)$/.test(name)) {
            return true;
        }
        const map = PropertyMap.from(this);
        if (map.map[name]) { return true; }
        if (this[name] !== undefined) { return true; }
        return false;
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
            // tslint:disable-next-line: no-console
            console.warn(`Do not bind promises, instead use Bind.oneWayAsync`);
            this.mPendingPromises[name] = p;
            p.then( (r) => {
                if (this.mPendingPromises [name] !== p) {
                    return;
                }
                this.mPendingPromises [name] = null;
                this.setPrimitiveValue(element, name, r);
            }).catch((e) => {
                if (this.mPendingPromises [name] !== p) {
                    return;
                }
                this.mPendingPromises [name] = null;
                // tslint:disable-next-line:no-console
                console.error(e);
            });
            return;
        }

        if (/^(viewModel|localViewModel)$/.test(name)) {
            this[name] = value;
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
            // tslint:disable-next-line: no-console
            console.warn(`Do not bind promises, instead use Bind.oneWayAsync`);
            this.mPendingPromises[name] = p;
            p.then( (r) => {
                if (this.mPendingPromises [name] !== p) {
                    return;
                }
                this.mPendingPromises [name] = null;
                this.setLocalValue(element, name, r);
            }).catch((e) => {
                if (this.mPendingPromises [name] !== p) {
                    return;
                }
                this.mPendingPromises [name] = null;
                // tslint:disable-next-line:no-console
                console.error(e);
            });
            return;
        }

        if ((!element || element === this.element) &&  Reflect.has(this, name)) {
            this[name] = value;
        } else {
            this.setElementValue(element, name, value);
        }
    }

    public dispose(e?: HTMLElement): void {

        if (this.mInvalidated) {
            clearTimeout(this.mInvalidated);
            this.mInvalidated = 0;
        }

        AtomBridge.instance.visitDescendents(e || this.element, (ex, ac) => {
            if (ac) {
                ac.dispose();
                return false;
            }
            return true;
        });

        if (!e) {
            this.unbindEvent(null, null, null);
            for (const binding of this.bindings) {
                binding.dispose();
            }
            this.bindings.length = 0;
            (this as any).bindings = null;
            // AtomBridge.instance.dispose(this.element);
            const e1 = this.element as any;
            if (typeof e1.dispose === "function") {
                e1.dispose();
            }
            (this as any).element = null;

            const lvm = this.localViewModel;
            if (lvm && lvm.dispose) {
                lvm.dispose();
                this.localViewModel = null;
            }

            const vm = this.viewModel;
            if (vm && vm.dispose) {
                vm.dispose();
                this.viewModel = null;
            }

            this.disposables.dispose();

            this.pendingInits = null;
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

    // tslint:disable-next-line:no-empty
    public onPropertyChanged(name: string): void {
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

    public beginEdit(): IDisposable {
        this.pendingInits = [];
        const a = this.pendingInits;
        return {
            dispose: () => {
                if (this.pendingInits == null) {
                    // case where current control is disposed...
                    return;
                }
                this.pendingInits = null;
                if (a) {
                    for (const iterator of a) {
                        iterator();
                    }
                }
                this.invalidate();
            }
        };
    }

    public invalidate(): void {
        if (this.mInvalidated) {
            clearTimeout(this.mInvalidated);
        }
        this.mInvalidated = setTimeout(() => {
            this.mInvalidated = 0;
            this.app.callLater(() => {
                this.onUpdateUI();
            });
        }, 5);
    }

    public onUpdateUI(): void {
        // for implementors..
    }

    public runAfterInit(f: () => void): void {
        if (this.pendingInits) {
            this.pendingInits.push(f);
        } else {
            f();
        }
    }

    public registerDisposable(d: IDisposable): IDisposable {
        return this.disposables.add(d);
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

    protected render(node: XNode, e: any = this.element, creator: any = this): void {

        const app = this.app;

        const attr = node.attributes;
        if (attr) {
            for (const key in attr) {
                if (attr.hasOwnProperty(key)) {
                    const item = attr[key];
                    const isObject = typeof item === "object";
                    // a bug in JavaScript, null is an object
                    if (isObject && item !== null) {
                        const localSymbol = item[localBindSymbol];
                        if (localSymbol) {
                            localSymbol(key, this, e, creator);
                            continue;
                        }
                        const localXNode = item[localXNodeSymbol];
                        if (localXNode) {
                            if (item.isTemplate) {
                                this.setLocalValue(e, key, this.toTemplate(app, item, creator));
                                continue;
                            }
                            this.setLocalValue(e, key, this.createNode(app, null, item, creator));
                            continue;
                        }
                    }
                    this.setLocalValue(e, key, item);
                }
            }
        }

        const children = node.children;
        if (children === void 0) {
            return;
        }

        for (const iterator of children) {
            if (!iterator) {
                continue;
            }
            if (typeof iterator === "string") {
                e.appendChild(document.createTextNode(iterator));
                continue;
            }
            if (iterator.isProperty) {
                if (iterator.isTemplate) {
                    this.setLocalValue(e, iterator.name, this.toTemplate(app, iterator.children[0], creator));
                    continue;
                }
                this.createNode(app, e, iterator, creator);
                continue;
            }
            // if (iterator.isProperty) {
            //     for (const child of iterator.children) {

            //         // this case of Xamarin Forms only..

            //         const e1 = this.createNode(app, null, child, creator);
            //         this.setLocalValue(e, iterator.name, e1);

            //         // const childName = child.name;
            //         // if (childName[isControl]) {
            //         //     const c1 = new (childName)(this.app);
            //         //     c1.render(child, c1.element, creator);
            //         //     (localBridge as any).instance.append(e, iterator.name, c1.element);
            //         //     continue;
            //         // }

            //         // const c2 = new (childName)();
            //         // this.render(child, c2, creator);
            //         // (localBridge as any).instance.append(e, iterator.name, c2);
            //         // const pc = AtomBridge.createNode(child, app);
            //         // (pc.control || this).render(child, pc.element, creator);

            //         // // in Xamarin.Forms certain properties are required to be
            //         // // set in advance, so we append the element after setting
            //         // // all children properties
            //         // (localBridge as any).instance.append(e, iterator.name, pc.element);
            //     }
            //     continue;
            // }
            const HTMLElement = iterator.attributes && iterator.attributes.template;
            if (HTMLElement) {
                console.warn(`This path is deprecated, check who is calling it.`);
                this.setLocalValue(e, HTMLElement, this.toTemplate(app, iterator, creator));
                continue;
            }

            this.createNode(app, e, iterator, creator);
        }

    }

    protected extractControlProperties(x: XNode, name: string | Function = "div") {
        const a = x.attributes;
        const extracted = {};
        if (typeof x.name === "function" && this instanceof (x.name as any)) {
            x.name = name;
        }
        if (a) {
            for (const key in a) {
                if (Object.prototype.hasOwnProperty.call(a, key)) {
                    if (Reflect.has(this, key)) {
                        const element = a[key];
                        extracted[key] = element;
                        delete a[key];
                    }
                }
            }
        }
        return extracted;
    }

    // tslint:disable-next-line:no-empty
    protected create(): void {
    }

    // tslint:disable-next-line:no-empty
    protected preCreate(): void {

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

    protected resolve<TService>(
        c: TService,
        selfName?: string |  (() => any)): IAnyInstanceType<TService> {
        const result = this.app.resolve(c, true);
        if (selfName) {
            if (typeof selfName === "function") {
                // this is required as parent is not available
                // in items control so binding becomes difficult
                this.runAfterInit(() => {
                    const v = selfName();
                    if (v) {
                        for (const key in v) {
                            if (v.hasOwnProperty(key)) {
                                const element = v[key];
                                result[key] = element;
                            }
                        }
                    }
                });
            } else {
                result[selfName] = this;
            }
        }
        return result;
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

export class PropertyBinding implements IDisposable {

    public path: ObjectProperty[][];

    private watcher: AtomWatcher<any>;
    private twoWaysDisposable: IDisposable;
    private isTwoWaySetup: boolean = false;
    private isRunning: boolean;

    private fromSourceToTarget: (...v: any[]) => any;
    private fromTargetToSource: (v: any) => any;
    private disposed: boolean;

    constructor(
        private target: AtomControl | any,
        public readonly element: HTMLElement,
        public readonly name: string,
        path: PathList[],
        private twoWays: boolean | string[],
        valueFunc: ((...v: any[]) => any) | IValueConverter,
        private source: any) {
        this.name = name;
        this.twoWays = twoWays;
        this.target = target;
        this.element = element;
        this.isRunning = false;
        if (valueFunc) {
            if (typeof valueFunc !== "function") {
                this.fromSourceToTarget = valueFunc.fromSource;
                this.fromTargetToSource = valueFunc.fromTarget;
            } else {
                this.fromSourceToTarget = valueFunc;
            }
        }
        this.watcher = new AtomWatcher(target, path,
            (...v: any[]) => {
                if (this.isRunning) {
                    return;
                }
                if (this.disposed) {
                    return;
                }
                // set value
                for (const iterator of v) {
                    if (iterator === undefined) {
                        return;
                    }
                }
                const cv = this.fromSourceToTarget ? this.fromSourceToTarget.apply(this, v) : v[0];
                if (cv === ignoreValue) {
                    return;
                }
                this.isRunning = true;
                try {
                    if (this.target instanceof AtomControl) {
                        this.target.setLocalValue(this.element, this.name, cv);
                    } else {
                        this.target[name] = cv;
                    }
                } finally {
                    this.isRunning = false;
                }
            },
            source
        );
        this.path = this.watcher.path;
        if (this.target instanceof AtomControl) {
            this.target.runAfterInit(() => {
                if (!this.watcher) {
                    // this is disposed ...
                    return;
                }
                this.watcher.init(true);
                if (twoWays) {
                    this.setupTwoWayBinding();
                }
            });
        } else {
            this.watcher.init(true);
            if (twoWays) {
                this.setupTwoWayBinding();
            }
        }
    }

    public setupTwoWayBinding(): void {

        if (this.target instanceof AtomControl) {
            if (this.element
                && (this.element !== this.target.element || !this.target.hasProperty(this.name))) {
                // most likely it has change event..
                let events: string[] = [];
                if (typeof this.twoWays !== "boolean") {
                    events = this.twoWays;
                }

                this.twoWaysDisposable = AtomBridge.instance.watchProperty(
                    this.element,
                    this.name,
                    events,
                    (v) => {
                        this.setInverseValue(v);
                    }
                );
                return;
            }
        }

        const watcher = new AtomWatcher(this.target, [[this.name]],
            (...values: any[]) => {
                if (this.isTwoWaySetup) {
                    this.setInverseValue(values[0]);
            }
        });
        watcher.init(true);
        this.isTwoWaySetup = true;
        this.twoWaysDisposable = watcher;
    }

    public setInverseValue(value: any): void {

        if (!this.twoWays) {
            throw new Error("This Binding is not two ways.");
        }

        if (this.disposed) {
            return;
        }
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        try {
            const first = this.path[0];
            const length = first.length;
            let v: any = this.target;
            let i = 0;
            let name: string;
            for (i = 0; i < length - 1; i ++) {
                name = first[i].name;
                if (name === "this") {
                    v = this.source || this.target;
                } else {
                    v = v[name];
                }
                if (!v) {
                    return;
                }
            }
            name = first[i].name;
            v[name] = this.fromTargetToSource ? this.fromTargetToSource.call(this, value) : value;
        } finally {
            this.isRunning = false;
        }

    }

    public dispose(): void {
        this.twoWaysDisposable?.dispose();
        this.twoWaysDisposable = undefined;
        this.watcher.dispose();
        this.disposed = true;
        this.watcher = null;
    }
}

document.body.addEventListener("click", (e) => {
    if (e.defaultPrevented) {
        return;
    }
    const originalTarget = e.target as HTMLElement;
    const control = AtomControl.from(originalTarget);
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
