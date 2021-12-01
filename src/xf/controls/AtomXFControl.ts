import { AtomBinder } from "../../core/AtomBinder";
import { AtomBridge, BaseElementBridge } from "../../core/AtomBridge";
import { AtomComponent } from "../../core/AtomComponent";
import Bind, { bindSymbol } from "../../core/Bind";
import { IAtomElement } from "../../core/types";
import XNode, { attachedProperties, attachedSymbol, constructorNeedsArgumentsSymbol, elementFactorySymbol, isControl, isFactorySymbol, isTemplateSymbol, xnodeSymbol } from "../../core/XNode";
import { TypeKey } from "../../di/TypeKey";
import { NavigationService } from "../../services/NavigationService";
import { AtomStyle } from "../../web/styles/AtomStyle";
import { AtomStyleSheet } from "../../web/styles/AtomStyleSheet";

declare var UMD: any;

UMD.defaultApp = "@web-atoms/core/dist/xf/XFApp";
UMD.viewPrefix = "xf";
AtomBridge.platform = "xf";

const defaultStyleSheets: { [key: string]: AtomStyle } = {};

const isAtomControl = isControl;

const isTemplate = isTemplateSymbol;

const objectHasOwnProperty = Object.prototype.hasOwnProperty;

const localBindSymbol = bindSymbol;
const localXNodeSymbol = xnodeSymbol;

const elementFactory = elementFactorySymbol;

const isFactory = isFactorySymbol;

const localBridge = AtomBridge;

const renderFirst = AtomBridge.platform === "xf";

const attached = attachedSymbol;

const constructorNeedsArguments = constructorNeedsArgumentsSymbol;

export class AtomXFControl extends AtomComponent<IAtomElement, AtomXFControl> {

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
                ( defaultStyleSheets[key] = this.theme.createNamedStyle(this.defaultControlStyle, key, 0));
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
            ( defaultStyleSheets[key] = this.theme.createNamedStyle(v, key, 0));
        }
        AtomBinder.refreshValue(this, "controlStyle");
        // this.invalidate();
    }

    public get theme(): AtomStyleSheet {
        return this.mTheme ||
            this.mCachedTheme ||
            (this.mCachedTheme = (this.parent ? this.parent.theme : this.app.resolve(AtomStyleSheet, false, null) ));
    }

    public get parent(): AtomXFControl {
        let e = this.element as any;
        e = e.parent;
        while (e) {
            const ac = e.atomControl;
            if (ac) {
                return ac;
            }
            e = e.parent;
        }
    }

    protected get factory() {
        return AtomXFControl;
    }

    private mTheme: AtomStyleSheet;
    private mCachedTheme: AtomStyleSheet;

    public atomParent(e: IAtomElement): AtomXFControl {
        // return AtomBridge.instance.atomParent(e, false) as any;
        let e1 = e as any;
        while (e1) {
            const ac = e1.atomControl;
            if (ac) {
                return ac;
            }
            e1 = e1.parent;
        }
    }

    public append(element: any): AtomXFControl {
        this.element.appendChild(element.element || element);
        return this;
    }

    // public dispose(e?: IAtomElement): void {
    //     const el = this.element;
    //     super.dispose(e);
    //     AtomBridge.instance.dispose(el);
    // }

    public invokeEvent(event: { type: string, detail?: any }): void {
        (AtomBridge.instance as any).invokeEvent(this.element, event.type, event);
    }

    public staticResource(name: string) {
        return (AtomBridge.instance as any).getStaticResource(this.element, name);
    }

    public loadXaml(text: string) {
        (AtomBridge.instance as any).loadXaml(this.element, text);
    }

    protected setElementValue(element: any, name: string, value: any): void {
        if (typeof name === "number") {
            // value is a function...
            attachedProperties[name](element, value);
            return;
        }
        if (/^event/.test(name)) {
            this.bindEvent(element, name.substr(5), async () => {
                try {
                    const p = value() as Promise<any>;
                    if (p) {
                        await p;
                    }
                } catch (e) {
                    if (/canceled|cancelled/i.test(e)) {
                        return;
                    }
                    const nav: NavigationService = this.app.resolve(NavigationService);
                    nav.alert(e, "Error").catch(() => {
                        // nothing...
                    });
                }
            });
            return;
        }
        if (/^(class|styleClass)$/i.test(name)) {
            let classes: string[];
            if (typeof value === "object") {
                classes = [];
                for (const key in value) {
                    if (value.hasOwnProperty(key)) {
                        const e1 = value[key];
                        if (e1) {
                            classes.push(key);
                        }
                    }
                }
            } else {
                classes = value.toString().split(" ");
            }
            value = classes.join(",");
            name = "class";
        }
        // AtomBridge.instance.setValue(element, name, value);
        element[name] = value;
    }

    protected createNode(app, e, iterator, creator) {
        const name = iterator.name;
        const attributes = iterator.attributes;
        if (typeof name === "string") {
            e.appendChild(name);
            return e;
            // throw new Error("not supported");
            // // document.createElement...
            // // const element = document.createElement(name);
            // // tslint:disable-next-line: no-console
            // console.log(`Creating ${name}`);
            // const element = document.createElement(name);
            // e?.appendChild(element);
            // this.render(iterator, element, creator);
            // return element;
        }

        if (objectHasOwnProperty.call(name, elementFactory)) {

            if (objectHasOwnProperty.call(name, constructorNeedsArguments)) {

                const templateFactory = name[isTemplate];
                if (templateFactory) {
                    const template = this.toTemplate(app, iterator, creator);
                    return templateFactory(template);
                }

                // look for Arguments..
                const firstChild = iterator.children?.[0];
                const childName = firstChild?.name;
                if (childName !== "WebAtoms.AtomX:Arguments") {
                    throw new Error("Arguments expected");
                }
                const pv = [];
                for (const child of firstChild.children) {
                    pv.push(this.createNode(app, e, child, creator));
                }
                const element1 = name(... pv);
                e?.appendChild(element1);
                return element1;
            }

            const element = new (name)();
            this.render(iterator, element, creator);
            e?.appendChild(element);
            return element;
        }

        if (name[isAtomControl]) {
            const forName = attributes?.for;
            const ctrl = new (name)(app,
                forName ? document.createElement(forName) : undefined);
            const element = ctrl.element ;
            ctrl.render(iterator, element, creator);
            e?.appendChild(element);
            return element;
        }

        const a = name[attached];
        if (a) {
            const child = this.createNode(app, null, iterator.children[0], creator);
            a(e, child);
            return e;
        }

        throw new Error(`not implemented create for ${name}`);
    }

    protected toTemplate(app, iterator, creator): any {
        const childNode = iterator.children[0];

        const name = childNode.name;
        if (typeof name === "string") {
            throw new Error(`Creating Template from string not supported, are you missing something?`);
        }

        if (name[isAtomControl]) {
            return class Template extends (name as any) {

                public create() {
                    super.create();
                    this.render(childNode, null, creator);
                }
            };
        }

        return class ElementTemplate extends AtomXFControl {
            constructor(a, e) {
                super(a ?? app, e ?? new (name)());
            }

            public create() {
                super.create();
                this.render(childNode, null, creator);
            }
        };
    }

}
declare var bridge;
bridge.controlFactory = AtomXFControl;

// add custom event...

declare var global;

global.CustomEvent = function(type: string, { detail }) {
    this.type = type;
    this.detail = detail;
};
