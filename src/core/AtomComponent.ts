import { App } from "../App";
import { AtomBridge } from "../core/AtomBridge";
// tslint:disable-next-line:import-spacing
import { ArrayHelper, CancelToken, IAnyInstanceType, IAtomElement, IClassOf, IDisposable, ignoreValue, INotifyPropertyChanged, PathList }
    from "../core/types";
import { Inject } from "../di/Inject";
import { NavigationService } from "../services/NavigationService";
import { AtomDisposableList } from "./AtomDisposableList";
import { AtomOnce } from "./AtomOnce";
import { AtomWatcher, ObjectProperty } from "./AtomWatcher";
import Bind, { bindSymbol } from "./Bind";
import { InheritedProperty } from "./InheritedProperty";
import { IValueConverter } from "./IValueConverter";
import { PropertyMap } from "./PropertyMap";
import XNode, { attachedSymbol, constructorNeedsArgumentsSymbol,
    elementFactorySymbol, isControl, isFactorySymbol, xnodeSymbol } from "./XNode";

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

const objectHasOwnProperty = Object.prototype.hasOwnProperty;

const localBindSymbol = bindSymbol;
const localXNodeSymbol = xnodeSymbol;

const elementFactory = elementFactorySymbol;

const isFactory = isFactorySymbol;

const isAtomControl = isControl;

const localBridge = AtomBridge;

const renderFirst = AtomBridge.platform === "xf";

const attached = attachedSymbol;

const constructorNeedsArguments = constructorNeedsArgumentsSymbol;

export abstract class AtomComponent<T extends IAtomElement, TC extends IAtomComponent<T>>
    implements IAtomComponent<IAtomElement>,
    INotifyPropertyChanged {

    public static readonly [isControl] = true;

    public static readonly [isFactorySymbol] = true;

    // public element: T;
    public readonly disposables: AtomDisposableList;

    public readonly element: T;

    @InheritedProperty
    public data: any;

    @InheritedProperty
    public viewModel: any;

    @InheritedProperty
    public localViewModel: any;

    protected pendingInits: Array<() => void>;

    private mInvalidated: any = 0;

    private mPendingPromises: { [key: string]: Promise<any> } = {};

    // private mData: any = undefined;
    // public get data(): any {
    //     if (this.mData !== undefined) {
    //         return this.mData;
    //     }
    //     const parent = this.parent;
    //     if (parent) {
    //         return parent.data;
    //     }
    //     return undefined;
    // }

    // public set data(v: any) {
    //     this.mData = v;
    //     AtomBridge.refreshInherited(this, "data");
    // }

    // private mViewModel: any = undefined;
    // public get viewModel(): any {
    //     if (this.mViewModel !== undefined) {
    //         return this.mViewModel;
    //     }
    //     const parent = this.parent;
    //     if (parent) {
    //         return parent.viewModel;
    //     }
    //     return undefined;
    // }

    // public set viewModel(v: any) {
    //     const old = this.mViewModel;
    //     if (old && old.dispose) {
    //         old.dispose();
    //     }
    //     this.mViewModel = v;
    //     AtomBridge.refreshInherited(this, "viewModel");
    // }

    // private mLocalViewModel: any = undefined;
    // public get localViewModel(): any {
    //     if (this.mLocalViewModel !== undefined) {
    //         return this.mLocalViewModel;
    //     }
    //     const parent = this.parent;
    //     if (parent) {
    //         return parent.localViewModel;
    //     }
    //     return undefined;
    // }

    // public set localViewModel(v: any) {
    //     const old = this.mLocalViewModel;
    //     if (old && old.dispose) {
    //         old.dispose();
    //     }
    //     this.mLocalViewModel = v;
    //     AtomBridge.refreshInherited(this, "localViewModel");
    // }

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
        element: T = null) {
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

    public abstract atomParent(e: T): TC;

    public bind(
        element: T,
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
        key?: string,
        capture?: boolean): IDisposable {
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
        const handler = (e) => {
            try {
                const r = (method as any)(e);
                if (r?.catch) {
                    return r.catch((c) => {
                        c = c?.toString() ?? "Unknown error";
                        if (CancelToken.isCancelled(c)) {
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
        element.addEventListener(name, handler, capture);
        be.disposable = {
            dispose: () => {
                element.removeEventListener(name, handler, capture);
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
            console.warn(`Do not bind promises, instead use Bind.oneWayAsync`)
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

        if (ignoreValue === value) {
            return;
        }

        if ((!element || element === this.element) &&  Reflect.has(this, name)) {
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

        const app = this.app;

        e = e || this.element;
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
                                this.setLocalValue(e, key, AtomBridge.toTemplate(app, item, creator));
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
            const t = iterator.attributes && iterator.attributes.template;
            if (t) {
                this.setLocalValue(e, t, AtomBridge.toTemplate(app, iterator, creator));
                continue;
            }

            this.createNode(app, e, iterator, creator);
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

    protected abstract createNode(app, e, iterator, creator);

    protected abstract toTemplate(app, iterator, creator);

    protected abstract get factory(): any;

}

export class PropertyBinding<T extends IAtomElement> implements IDisposable {

    public path: ObjectProperty[][];

    private watcher: AtomWatcher<any>;
    private twoWaysDisposable: IDisposable;
    private isTwoWaySetup: boolean = false;
    private updaterOnce: AtomOnce;

    private fromSourceToTarget: (...v: any[]) => any;
    private fromTargetToSource: (v: any) => any;
    private disposed: boolean;

    constructor(
        private target: IAtomComponent<T> | any,
        public readonly element: T,
        public readonly name: string,
        path: PathList[],
        private twoWays: boolean | string[],
        valueFunc: ((...v: any[]) => any) | IValueConverter,
        private source: any) {
        this.name = name;
        this.twoWays = twoWays;
        this.target = target;
        this.element = element;
        this.updaterOnce = new AtomOnce();
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
                this.updaterOnce.run(() => {
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
                    if (this.target instanceof AtomComponent) {
                        this.target.setLocalValue(this.element, this.name, cv);
                    } else {
                        this.target[name] = cv;
                    }
                });
            },
            source
        );
        this.path = this.watcher.path;
        if (this.target instanceof AtomComponent) {
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

        if (this.target instanceof AtomComponent) {
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

        this.updaterOnce.run(() => {
            if (this.disposed) {
                return;
            }
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
        });

    }

    public dispose(): void {
        if (this.twoWaysDisposable) {
            this.twoWaysDisposable.dispose();
            this.twoWaysDisposable = null;
        }
        this.watcher.dispose();
        this.disposed = true;
        this.watcher = null;
    }
}
