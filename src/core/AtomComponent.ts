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
import XNode from "./xnode/XNode";

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
    public get vsProp(): { [k in keyof this]?: any} | { [k: string]: any } | {} {
        return undefined;
    }

    // public abstract get templateParent(): TC;
    // {
    //     return AtomBridge.instance.templateParent(this.element);
    // }

    private eventHandlers: Array<IEventObject<T>> = [];

    private bindings: Array<PropertyBinding<T>> = [];

    constructor(
        @Inject public readonly app: App,
        element: T | XNode = null) {
        // if (!app) {
        //     // tslint:disable-next-line:no-console
        //     console.error("app cannot be null while creating control");
        // }
        this.disposables = new AtomDisposableList();
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
        const deleted: Array<IEventObject<T>> = [];
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
            deleted.push(be);
        }
        this.eventHandlers = this.eventHandlers.filter( (x) => deleted.findIndex( (d) => d === x ) !== -1 );
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
            this.bindings = null;
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

    protected abstract render(node: XNode): void;

    // tslint:disable-next-line:no-empty
    protected create(): void {
        if ((this.element as any) instanceof XNode) {
            this.render(this.element as any);
        }
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
