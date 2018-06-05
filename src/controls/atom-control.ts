import { Atom } from "../atom";
import { AtomBinder } from "../core/atom-binder";
import { AtomDispatcher } from "../core/atom-dispatcher";
import { AtomUI } from "../core/atom-ui";
import { AtomBridge } from "../core/bridge";
import { PropertyBinding } from "../core/property-binding";
import { ArrayHelper, AtomDisposable, IAtomElement, IDisposable, INativeComponent } from "../core/types";

interface IEventObject {

    element: IAtomElement;

    name?: string;

    handler?: EventListenerOrEventListenerObject;

    key?: string;

    disposable?: IDisposable;

}

export class AtomControl {

    public element: IAtomElement;

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

    public get parent(): AtomControl {
        const ep = AtomBridge.instance.elementParent(this.element);
        if (!ep) {
            return null;
        }
        return AtomBridge.instance.atomParent(ep) as AtomControl;
    }

    public get templateParent(): AtomControl {
        return AtomBridge.instance.templateParent(this.element);
    }

    private eventHandlers: IEventObject[] = [];

    private bindings: PropertyBinding[] = [];

    constructor(e?: IAtomElement) {
        this.element = e;
        this.create();
        AtomBridge.instance.attachControl(this.element, this);
    }

    // [key: string]: any;

    public bind(
        element: IAtomElement,
        name: string,
        path: string[],
        twoWays?: boolean,
        valueFunc?: (v: any[]) => any): IDisposable {

        // remove exisiting binding if any
        let binding = this.bindings.find( (x) => x.name === name && (element ? x.element === element : true));
        if (binding) {
            binding.dispose();
            ArrayHelper.remove(this.bindings, (x) => x === binding);
        }
        binding = new PropertyBinding(this, element, name, path, twoWays, valueFunc);
        this.bindings.push(binding);

        if (binding.twoWays) {
            binding.setupTwoWayBinding();
        }

        return new AtomDisposable(() => {
            binding.dispose();
            ArrayHelper.remove(this.bindings, (x) => x === binding);
        });
    }

    public bindEvent(
        element: IAtomElement,
        name?: string,
        method?: EventListenerOrEventListenerObject,
        key?: string): void {
        if (!element) {
            return;
        }
        if (!method) {
            return;
        }
        const be: IEventObject = {
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
        element: HTMLElement,
        name?: string,
        method?: EventListenerOrEventListenerObject,
        key?: string): void {
        const deleted: IEventObject[] = [];
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
        return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), name) as boolean;
    }

    public setLocalValue(element: IAtomElement, name: string, value: any): void {
        if ((!element || element === this.element) &&  this.hasProperty(name)) {
            this[name] = value;
        } else {
            AtomBridge.instance.setValue(element, name, value);
        }
    }

    public dispose(e?: IAtomElement): void {

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

    public append(element: IAtomElement | AtomControl): AtomControl {
        const ac = element instanceof AtomControl ? element : null;
        const e = ac ? ac.element : element;
        AtomBridge.instance.appendChild(this.element, e);
        if (ac) {
            ac.refreshInherited("viewModel", (a) => a.mViewModel === undefined);
            ac.refreshInherited("localViewModel", (a) => a.mLocalViewModel === undefined);
            ac.refreshInherited("data", (a) => a.mData === undefined);
        }
        return this;
    }

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

    // tslint:disable-next-line:no-empty
    protected create(): void {

    }

    // protected postInit(): void {
    //     AtomDispatcher.instance.callLater(()=>{
    //         this.init();
    //     });
    // }

    private refreshInherited(name: string, fx: (ac: AtomControl) => boolean): void {
        AtomBinder.refreshValue(this, name);
        AtomBridge.instance.visitDescendents(this.element, (e, ac) => {
            if (ac) {
                if (fx(ac)) {
                    ac.refreshInherited(name, fx);
                }
                return false;
            }
            return true;
        });
    }

    // tslint:disable-next-line:member-ordering
    public static updateUI(): any {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line:member-ordering
    public static disposeChildren(arg0: any): any {
        throw new Error("Method not implemented.");
    }

    // tslint:disable-next-line:member-ordering
    public static invokeAction(arg0: any): any {
        throw new Error("Method not implemented.");
    }

}
