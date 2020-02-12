import { AjaxOptions } from "../services/http/AjaxOptions";
import { AtomUI, ChildEnumerator } from "../web/core/AtomUI";
import { AtomBinder } from "./AtomBinder";
import { IAtomElement, IDisposable, INameValuePairs, INativeComponent, IUIAtomControl } from "./types";
import XNode from "./XNode";

export abstract class BaseElementBridge<T extends IAtomElement> {

    public controlFactory: any;

    public createBusyIndicator: () => IDisposable;

    public ajax: (
        url: string,
        options: AjaxOptions,
        success: (r) => void,
        failed: (r) => void,
        progress: (p) => void) => void;

    public setTemplate: (element: any, name: string, templateFactory: () => any) => void;

    public setImport: (element: any, name: string, templateFactory: () => any) => void;
    public reset: () => void;

    public abstract create(type: string | ((n: any, ... nodes: XNode[]) => XNode), node: any, app: any): T;

    public abstract attachControl(element: T, control: IUIAtomControl): void;

    public abstract addEventHandler(
        element: T,
        name: string,
        handler: EventListenerOrEventListenerObject,
        capture?: boolean): IDisposable;

    public abstract atomParent(element: T, climbUp?: boolean): IUIAtomControl;

    public abstract elementParent(element: T): T;

    public abstract templateParent(element: T): IUIAtomControl;

    public abstract visitDescendents(element: T, action: (e: T, ac: IUIAtomControl) => boolean): void;

    public abstract dispose(element: T): void;

    public abstract appendChild(parent: T, child: T): void;

    public abstract getValue(element: HTMLElement, name: string): any;

    public abstract setValue(element: T, name: string, value: any): void;

    public abstract watchProperty(element: T, name: string, events: string[], f: (v: any) => void): IDisposable;

    public abstract loadContent(element: T, text: string): void;

    public abstract findChild(element: T, name: string): T;

    public abstract close(element: T, success: () => void, error: (e) => void): void;

    public refreshInherited(target: { element: T }, name: string, fieldName?: string): void {
        AtomBinder.refreshValue(target, name);
        if (!fieldName) {
            fieldName = "m" + name[0].toUpperCase() + name.substr(1);
        }
        this.visitDescendents(target.element, (e, ac) => {
            if (ac) {
                if (ac[fieldName] === undefined) {
                    this.refreshInherited(ac as any, name, fieldName);
                }
                return false;
            }
            return true;
        });

    }

    public createNode(
        target: any,
        node: XNode,
        // tslint:disable-next-line: ban-types
        binder: Function,
        // tslint:disable-next-line: ban-types
        xNodeClass: Function,
        // tslint:disable-next-line: ban-types
        creator: Function): any {
        throw new Error("Method not implemented.");
    }

}

export class AtomElementBridge extends BaseElementBridge<HTMLElement> {

    public addEventHandler(
        element: HTMLElement,
        name: string,
        handler: EventListenerOrEventListenerObject,
        capture?: boolean): IDisposable {
            element.addEventListener(name, handler, capture);
            return {
                dispose: () => {
                    element.removeEventListener(name, handler, capture);
                }
            };
        }

        public atomParent(element: HTMLElement, climbUp: boolean = true): IUIAtomControl {
            const eAny: INameValuePairs = element as INameValuePairs;
            if (eAny.atomControl) {
                return eAny.atomControl;
            }
            if (!climbUp) {
                return null;
            }
            if (!element.parentNode) {
                return null;
            }
            return this.atomParent(this.elementParent(element));
    }

    public elementParent(element: HTMLElement): HTMLElement {
        const eAny = element as any;
        const lp = eAny._logicalParent;
        if (lp) {
            return lp;
        }
        return element.parentElement;
    }

    public templateParent(element: HTMLElement): IUIAtomControl {
        if (!element) {
            return null;
        }
        const eAny = element as any;
        if (eAny._templateParent) {
            return this.atomParent(element);
        }
        const parent = this.elementParent(element);
        if (!parent) {
            return null;
        }
        return this.templateParent(parent);
    }

    public visitDescendents(element: HTMLElement, action: (e: HTMLElement, ac: IUIAtomControl) => boolean): void  {

        const en = new ChildEnumerator(element);
        while (en.next()) {
            const iterator = en.current;
            const eAny = iterator as any;
            const ac = eAny ? eAny.atomControl : undefined;

            if (!action(iterator, ac)) {
                continue;
            }
            this.visitDescendents(iterator, action);
        }
    }

    public dispose(element: HTMLElement): void {
        const eAny = element as any;
        eAny.atomControl = undefined;
        eAny.innerHTML = "";
        delete eAny.atomControl;
    }

    public appendChild(parent: HTMLElement, child: HTMLElement): void {
        parent.appendChild(child);
    }

    public setValue(element: HTMLElement, name: string, value: any): void {
        element[name] = value;
    }

    public getValue(element: HTMLElement, name: string): any {
        return element[name];
    }

    public watchProperty(element: HTMLElement, name: string, events: string[], f: (v: any) => void): IDisposable {

        if (events.indexOf("change") === -1) {
            events.push("change");
        }

        const l = (e) => {
            const e1 = element as HTMLInputElement;
            const v = e1.type === "checkbox" ? e1.checked : e1.value;
            f(v);
        };
        for (const iterator of events) {
            element.addEventListener(iterator, l , false);
        }

        return {
            dispose: () => {
                for (const iterator of events) {
                    element.removeEventListener(iterator, l, false);
                }
            }
        };
    }

    public attachControl(element: HTMLElement, control: IUIAtomControl): void {
        (element as any).atomControl = control;
    }

    public create(type: string): HTMLElement {
        return document.createElement(type);
    }

    public loadContent(element: HTMLElement, text: string): void {
        throw new Error("Not supported");
    }

    public findChild(element: HTMLElement, name: string): HTMLElement {
        throw new Error("Not supported");
    }

    public close(element: HTMLElement, success: () => void, error: (e) => void): void {
        throw new Error("Not supported");
    }

    public toTemplate(element, creator) {
        const templateNode = element as any;
        const name = templateNode.name;
        if (typeof name === "string") {
            element = ((bx, n) => class extends bx {

                public create(): void {
                    this.render(n);
                }

            })(creator as any, templateNode.children[0]);

        } else {
            element = ((base, n) => class extends base {

                public create(): void {
                    this.render(n);
                }

            })(name, templateNode.children[0]);
        }
        return element;
    }

    public createNode(
        target: any,
        node: XNode,
        // tslint:disable-next-line: ban-types
        binder: Function,
        // tslint:disable-next-line: ban-types
        xNodeClass: Function,
        // tslint:disable-next-line: ban-types
        creator: Function): any {

        let parent = null;

        const app = target.app;
        let e: HTMLElement = null;
        const nn = node.attributes ? node.attributes.for : undefined;
        if (typeof node.name === "string") {
            // it is simple node..
            e = document.createElement(node.name);
            parent = e;
            if (nn) {
                delete node.attributes.for;
            }
        } else {
            if (nn) {
                target = new (node.name as any)(app, document.createElement(nn));
                delete node.attributes.for;
            }
            target = new (node.name as any)(app);
            e = target.element;
            parent = target;
            // target.append(child);
            // const firstChild = node.children ? node.children[0] : null;
            // if (firstChild) {
            // 	const n = this.createNode(child, firstChild, binder, xNodeClass, creator);
            // 	child.append(n.atomControl || n);
            // }
            // return child.element;
        }

        const a = node.attributes;
        if (a) {
            for (const key in a) {
                if (a.hasOwnProperty(key)) {
                    let element = a[key] as any;
                    if (element instanceof binder) {
                        if (/^event/.test(key)) {
                            let ev = key.substr(5);
                            if (ev.startsWith("-")) {
                                ev = ev.split("-").map((s) => s[0].toLowerCase() + s.substr(1)).join("");
                            } else {
                                ev = ev[0].toLowerCase() + ev.substr(1);
                            }
                            (element as any).setupFunction(ev, element, target, e);
                        } else {
                            (element as any).setupFunction(key, element, target, e);
                        }
                    } else {

                        // this is template...
                        if (element instanceof xNodeClass) {
                            element = this.toTemplate(element, creator);
                        }
                        target.setLocalValue(e, key, element);
                    }
                }
            }
        }

        const children = node.children;
        if (children) {
            for (const iterator of children) {
                if (typeof iterator === "string") {
                    e.appendChild(document.createTextNode(iterator));
                    continue;
                }
                const t = iterator.attributes ? iterator.attributes.template : null;
                if (t) {
                    const tx = this.toTemplate(iterator, creator);
                    target[t] = tx;
                    continue;
                }
                if (typeof iterator.name === "string") {
                    e.appendChild(this.createNode(target, iterator, binder, xNodeClass, creator));
                    continue;
                }
                const child = this.createNode(target, iterator, binder, xNodeClass, creator);
                if (parent.element && parent.element.atomControl === parent) {
                    parent.append(child.atomControl || child);
                } else {
                    parent.appendChild(child);
                }
            }
        }
        return e;
    }
}

export class AtomBridge {

    public static platform: "web" | "xf";

    public static instance: BaseElementBridge<IAtomElement>;

    public static create(name: string, a?: any, app?: any): IAtomElement {
        return this.instance.create(name, a, app);
    }

    public static createNode(iterator: XNode, app: any): { element?: any, control?: any } {
        if (typeof iterator.name !== "function") {

            return { element: this.instance.create(iterator.name.toString(), iterator, app) };
        }
        const fx = iterator.attributes ? iterator.attributes.for : undefined;
        const c = new (iterator.name as any)(app, fx ? this.instance.create(fx, iterator, app) : undefined) as any;
        return { element: c.element, control: c };
    }

    public static toTemplate(app: any, n: XNode, creator: any) {

        if (n.isTemplate) {
            const t = AtomBridge.toTemplate(app, n.children[0], creator);
            return AtomBridge.instance.create(n.name.toString(), t, app);
        }

        const bridge = AtomBridge.instance;
        let fx;
        let en;
        if (typeof n.name === "function") {
            fx = n.name;
            en = (n.attributes && n.attributes.for) ? n.attributes.for : undefined;
        } else {
            fx = bridge.controlFactory;
            en = n.name;
        }

        return class Template extends (fx as any) {

            // tslint:disable-next-line: variable-name
            public _creator = fx;

            constructor(a, e1) {
                super(a || app, e1 || (en ? bridge.create(en, null, app) : undefined));
            }

            public create() {
                super.create();
                this.render(n, null, creator);
            }

        };
    }

    public static refreshInherited(target: { element: any }, name: string, fieldName?: string): void {
        if (AtomBridge.instance.refreshInherited) {
            AtomBridge.instance.refreshInherited(target, name, fieldName);
            return;
        }
        AtomBinder.refreshValue(target, name);
        if (!fieldName) {
            fieldName = "m" + name[0].toUpperCase() + name.substr(1);
        }
        AtomBridge.instance.visitDescendents(target.element, (e, ac) => {
            if (ac) {
                if (ac[fieldName] === undefined) {
                    AtomBridge.refreshInherited(ac as any, name, fieldName);
                }
                return false;
            }
            return true;
        });

    }

}
