import { App } from "../App";
import { Atom } from "../Atom";
import { AtomBridge } from "../core/AtomBridge";
import { AtomDispatcher } from "../core/AtomDispatcher";
import { PropertyBinding } from "../core/PropertyBinding";
import { PropertyMap } from "../core/PropertyMap";
// tslint:disable-next-line:import-spacing
import { ArrayHelper, IAtomElement, IClassOf, IDisposable, INotifyPropertyChanged, PathList }
    from "../core/types";
import { Inject } from "../di/Inject";
import { AtomDisposableList } from "./AtomDisposableList";
import Bind from "./Bind";
import XNode from "./XNode";

const bridge = AtomBridge.instance;

interface IEventObject<T> {

    element: T;

    name?: string;

    handler?: EventListenerOrEventListenerObject;

    key?: string;

    disposable?: IDisposable;

}

export interface IAtomComponent<T> {
    element: T;
    data: any;
    viewModel: any;
    localViewModel: any;
    app: App;
    setLocalValue(e: T, name: string, value: any): void;
    hasProperty(name: string);
    runAfterInit(f: () => void ): void;
}

export abstract class AtomComponent<T extends IAtomElement, TC extends IAtomComponent<T>>
    implements IAtomComponent<IAtomElement>,
    INotifyPropertyChanged {

    // public element: T;
    public readonly disposables: AtomDisposableList;

    public readonly element: T;

    protected pendingInits: Array<() => void>;

    private mInvalidated: any = 0;

    private mPendingPromises: { [key: string]: Promise<any> } = {};

    private mData: any = undefined;
    public get data(): any {
        if (this.mData !== undefined) {
            return this.mData;
        }
        const parent = this.parent;
        if (parent) {
            return parent.data;
        }
        return undefined;
    }

    public set data(v: any) {
        this.mData = v;
        AtomBridge.refreshInherited(this, "data");
    }

    private mViewModel: any = undefined;
    public get viewModel(): any {
        if (this.mViewModel !== undefined) {
            return this.mViewModel;
        }
        const parent = this.parent;
        if (parent) {
            return parent.viewModel;
        }
        return undefined;
    }

    public set viewModel(v: any) {
        const old = this.mViewModel;
        if (old && old.dispose) {
            old.dispose();
        }
        this.mViewModel = v;
        AtomBridge.refreshInherited(this, "viewModel");
    }

    private mLocalViewModel: any = undefined;
    public get localViewModel(): any {
        if (this.mLocalViewModel !== undefined) {
            return this.mLocalViewModel;
        }
        const parent = this.parent;
        if (parent) {
            return parent.localViewModel;
        }
        return undefined;
    }

    public set localViewModel(v: any) {
        const old = this.mLocalViewModel;
        if (old && old.dispose) {
            old.dispose();
        }
        this.mLocalViewModel = v;
        AtomBridge.refreshInherited(this, "localViewModel");
    }

    public abstract get parent(): TC;

    /** Do not ever use, only available as intellisense feature for
     * vs code editor.
     */
    public get vsProps(): { [k in keyof this]?: any} | { [k: string]: any } | {} {
        return undefined;
    }

    // public abstract get templateParent(): TC;
    // {
    //     return AtomBridge.instance.templateParent(this.element);
    // }

    private readonly eventHandlers: Array<IEventObject<T>>;

    private readonly bindings: Array<PropertyBinding<T>>;

    constructor(
        @Inject public readonly app: App,
        element: T) {
        // if (!app) {
        //     // tslint:disable-next-line:no-console
        //     console.error("app cannot be null while creating control");
        // }
        this.disposables = new AtomDisposableList();
        this.bindings = [];
        this.eventHandlers = [];
        this.element = element as any;
        const a = this.beginEdit();
        this.preCreate();
        this.create();
        AtomBridge.instance.attachControl(this.element, this as any);
        app.callLater(() => a.dispose());
    }

    public abstract atomParent(e: T): TC;

    public bind(
        element: T,
        name: string,
        path: PathList[],
        twoWays?: boolean | string[],
        valueFunc?: (...v: any[]) => any,
        source?: any): IDisposable {

        // remove existing binding if any
        let binding = this.bindings.find( (x) => x.name === name && (element ? x.element === element : true));
        if (binding) {
            binding.dispose();
            ArrayHelper.remove(this.bindings, (x) => x === binding);
        }
        binding = new PropertyBinding(this, element, name, path, twoWays, valueFunc, source);
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
     * @param element T
     * @param name string
     */
    public unbind(element: T, name?: string): void {
        const toDelete = this.bindings.filter( (x) => x.element === element && (!name || (x.name === name)));
        for (const iterator of toDelete) {
            iterator.dispose();
            ArrayHelper.remove(this.bindings, (x) => x === iterator);
        }
    }

    public bindEvent(
        element: T,
        name?: string,
        method?: EventListenerOrEventListenerObject,
        key?: string): IDisposable {
        if (!element) {
            return;
        }
        if (!method) {
            return;
        }
        const be: IEventObject<T> = {
            element,
            name,
            handler: method
        };
        if (key) {
            be.key = key;
        }
        be.disposable = AtomBridge.instance.addEventHandler(element, name, method, false);
        this.eventHandlers.push(be);

        return {
            dispose: () => {
                be.disposable.dispose();
                ArrayHelper.remove(this.eventHandlers, (e) => e.disposable === be.disposable);
            }
        };
    }

    public unbindEvent(
        element: T,
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

    public hasProperty(name: string): boolean {
        if (this[name] !== undefined) {
            return true;
        }
        const map = PropertyMap.from(this);
        return map.map[name];
    }

    /**
     * Use this method if you want to set attribute on HTMLElement immediately but
     * defer atom control property
     * @param element HTMLElement
     * @param name string
     * @param value any
     */
    public setPrimitiveValue(element: T, name: string, value: any): void {
        const p = value as Promise<any>;
        if (p && p.then && p.catch) {
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

    public setLocalValue(element: T, name: string, value: any): void {

        // if value is a promise
        const p = value as Promise<any>;
        if (p && p.then && p.catch) {
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

        if ((!element || element === this.element) &&  this.hasProperty(name)) {
            this[name] = value;
        } else {
            this.setElementValue(element, name, value);
        }
    }

    public dispose(e?: T): void {

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
            AtomBridge.instance.dispose(this.element);
            (this as any).element = null;

            const lvm = this.mLocalViewModel;
            if (lvm && lvm.dispose) {
                lvm.dispose();
                this.mLocalViewModel = null;
            }

            const vm = this.mViewModel;
            if (vm && vm.dispose) {
                vm.dispose();
                this.mViewModel = null;
            }

            this.disposables.dispose();

            this.pendingInits = null;
        }
    }

    public abstract append(element: T | TC): TC;

    // tslint:disable-next-line:no-empty
    public onPropertyChanged(name: string): void {

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

    protected render(node: XNode, e?: any, creator?: any): void {

        creator = creator || this;

        // element must be created before creating control
        // so in preCreate element should be available if
        // control wants to add default behavior

        // (this as any).element = bridge.createNode(this, node, Bind, XNode, AtomControl);

        function toTemplate(n: XNode) {
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
                    super(a, e1 || (en ? bridge.create(en) : undefined));
                }

                public create() {
                    super.create();
                    this.render(n, null, creator);
                }

            };
        }

        const app = this.app;

        function create(iterator: XNode): { element?: any, control?: any } {
            if (typeof iterator.name === "string") {

                return { element: bridge.create(iterator.name) };
            }
            const fx = iterator.attributes ? iterator.attributes.for : undefined;
            const c = new (iterator.name as any)(app, fx ? bridge.create(fx) : undefined) as any;
            return { element: c.element, control: c };
        }

        e = e || this.element;
        const attr = node.attributes;
        if (attr) {
            for (const key in attr) {
                if (attr.hasOwnProperty(key)) {
                    const item = attr[key];
                    if (item instanceof Bind) {
                        item.setupFunction(key, item, this, e, creator);
                    } else if (item instanceof XNode) {
                        // this is template..
                        this.setLocalValue(e, key, toTemplate(item));
                    } else {
                        this.setLocalValue(e, key, item);
                    }
                }
            }
        }

        for (const iterator of node.children) {
            if (typeof iterator === "string") {
                e.appendChild(document.createTextNode(iterator));
                continue;
            }
            if (iterator.isTemplate) {
                this.setLocalValue(e, iterator.name, toTemplate(iterator.children[0]));
                continue;
            }
            if (iterator.isProperty) {
                for (const child of iterator.children) {
                    const pc = create(child);
                    (bridge as any).append(e, iterator.name, pc.element);
                    (pc.control || this).render(child, pc.element, creator);
                }
                continue;
            }
            const t = iterator.attributes && iterator.attributes.template;
            if (t) {
                this.setLocalValue(e, t, toTemplate(iterator));
                continue;
            }
            const c = create(iterator);
            if (this.element === e) {
                this.append(c.control || c.element);
            } else {
                e.appendChild(c.element);
            }
            (c.control || this).render(iterator, c.element, creator);
            // if (typeof iterator.name === "string") {

            //     const ex = bridge.create(iterator.name);
            //     if (this.element === e) {
            //         this.append(ex as any);
            //     } else {
            //         e.appendChild(ex);
            //     }
            //     this.render(iterator, ex, creator);
            //     continue;
            // }
            // const fx = iterator.attributes ? iterator.attributes.for : undefined;
            // const c = new (iterator.name)(this.app, fx ? bridge.create(fx) : undefined) as any;
            // if (this.element === e) {
            //     this.append(c);
            //     c.render(iterator, c.element, creator);
            // } else {
            //     e.appendChild(c.element);
            //     c.render(iterator, c.element, creator);
            // }
        }

    }

    // tslint:disable-next-line:no-empty
    protected create(): void {
    }

    // tslint:disable-next-line:no-empty
    protected preCreate(): void {

    }

    protected setElementValue(element: T, name: string, value: any): void {
        AtomBridge.instance.setValue(element, name, value);
    }

    protected resolve<TService>(
        c: IClassOf<TService>,
        selfName?: string |  (() => any)): TService {
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

}
