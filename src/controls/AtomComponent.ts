import { Atom } from "../Atom";
import { AtomUI } from "../core/atom-ui";
import { AtomBinder } from "../core/AtomBinder";
import { AtomDispatcher } from "../core/AtomDispatcher";
import { AtomBridge } from "../core/bridge";
import { PropertyBinding } from "../core/PropertyBinding";
import { PropertyMap } from "../core/PropertyMap";
// tslint:disable-next-line:import-spacing
import { ArrayHelper, AtomDisposable, IAtomElement, IClassOf, IDisposable, INotifyPropertyChanged, PathList }
    from "../core/types";
import { ServiceProvider } from "../di/ServiceProvider";

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
    setLocalValue(e: T, name: string, value: any): void;
    hasProperty(name: string);
    runAfterInit(f: () => void ): void;
}

export abstract class AtomComponent<T extends IAtomElement, TC extends IAtomComponent<T>>
    implements IAtomComponent<IAtomElement>,
    INotifyPropertyChanged {

    public element: T;

    protected pendingInits: Array<() => void>;

    private mInvalidated: number = 0;

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
        this.refreshInherited("data", (a) => a.mData === undefined);
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
        this.mViewModel = v;
        this.refreshInherited("viewModel", (a) => a.mViewModel === undefined);
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
        this.mLocalViewModel = v;
        this.refreshInherited("localViewModel", (a) => a.mLocalViewModel === undefined);
    }

    public abstract get parent(): TC;

    public abstract get templateParent(): TC;
    // {
    //     return AtomBridge.instance.templateParent(this.element);
    // }

    private eventHandlers: Array<IEventObject<T>> = [];

    private bindings: Array<PropertyBinding<T>> = [];

    constructor(e?: T) {
        this.element = e;
        const a = this.beginEdit();
        this.create();
        this.attachControl();
        AtomDispatcher.instance.callLater(() => a.dispose());
    }

    public abstract atomParent(e: T): TC;
    // {
    //     const ep = AtomBridge.instance.elementParent(this.element);
    //     if (!ep) {
    //         return null;
    //     }
    //     return AtomBridge.instance.atomParent(ep) as TC;
    // }

    public abstract attachControl(): void;
    // {
    //     // AtomBridge.instance.attachControl(this.element, this);
    // }

    // [key: string]: any;

    public bind(
        element: T,
        name: string,
        path: PathList[],
        twoWays?: boolean,
        valueFunc?: (...v: any[]) => any): IDisposable {

        // remove exisiting binding if any
        let binding = this.bindings.find( (x) => x.name === name && (element ? x.element === element : true));
        if (binding) {
            binding.dispose();
            ArrayHelper.remove(this.bindings, (x) => x === binding);
        }
        binding = new PropertyBinding(this, element, name, path, twoWays, valueFunc);
        this.bindings.push(binding);

        return new AtomDisposable(() => {
            binding.dispose();
            ArrayHelper.remove(this.bindings, (x) => x === binding);
        });
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
        key?: string): void {
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
        const map = PropertyMap.from(this);
        return map.map[name];
    }

    public setLocalValue(element: T, name: string, value: any): void {
        if ((!element || element === this.element) &&  this.hasProperty(name)) {
            this[name] = value;
        } else {
            AtomBridge.instance.setValue(element, name, value);
        }
    }

    public dispose(e?: T): void {

        AtomBridge.instance.visitDescendents(e || this.element, (ec, ac) => {
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
            this.element = null;
        }
    }

    public abstract append(element: T | TC): TC;
    // {
    //     const ac = element instanceof TC ? element : null;
    //     const e = ac ? ac.element : element;
    //     AtomBridge.instance.appendChild(this.element, e);
    //     if (ac) {
    //         ac.refreshInherited("viewModel", (a) => a.mViewModel === undefined);
    //         ac.refreshInherited("localViewModel", (a) => a.mLocalViewModel === undefined);
    //         ac.refreshInherited("data", (a) => a.mData === undefined);
    //     }
    //     return this;
    // }

    // init is no longer needed !!!
    // public init(): void {
    //     AtomBridge.instance.visitDescendents(this.element, (e, ac) => {
    //         if (ac) {
    //             ac.init();
    //             return false;
    //         }
    //         return true;
    //     });
    // }

    // tslint:disable-next-line:no-empty
    public onPropertyChanged(name: string): void {

    }

    public beginEdit(): IDisposable {
        this.pendingInits = [];
        const a = this.pendingInits;
        return new AtomDisposable(() => {
            this.pendingInits = null;
            if (a) {
                for (const iterator of a) {
                    iterator();
                }
            }
            this.invalidate();
        });
    }

    public invalidate(): void {
        if (this.mInvalidated) {
            clearTimeout(this.mInvalidated);
        }
        this.mInvalidated = setTimeout(() => {
            this.mInvalidated = 0;
            AtomDispatcher.instance.callLater(() => {
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

    // public abstract init(): void;

    // tslint:disable-next-line:no-empty
    protected create(): void {

    }

    protected getValue(path: string) {
        return Atom.get(this, path);
    }

    protected resolve<TService>(c: IClassOf<TService> ): TService {
        return ServiceProvider.global.get(c);
    }

    // protected postInit(): void {
    //     AtomDispatcher.instance.callLater(()=>{
    //         this.init();
    //     });
    // }

    protected abstract refreshInherited(name: string, fx: (ac: AtomComponent<T, TC>) => boolean): void;
    // {
    //     AtomBinder.refreshValue(this, name);
    //     AtomBridge.instance.visitDescendents(this.element, (e, ac) => {
    //         if (ac) {
    //             if (fx(ac)) {
    //                 ac.refreshInherited(name, fx);
    //             }
    //             return false;
    //         }
    //         return true;
    //     });
    // }

    // tslint:disable-next-line:member-ordering
    // public static updateUI(): any {
    //     throw new Error("Method not implemented.");
    // }

    // tslint:disable-next-line:member-ordering
    // public static disposeChildren(arg0: any): any {
    //     throw new Error("Method not implemented.");
    // }

    // tslint:disable-next-line:member-ordering
    // public static invokeAction(arg0: any): any {
    //     throw new Error("Method not implemented.");
    // }

}
