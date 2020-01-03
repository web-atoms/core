import { App, AtomAction } from "../App";
import { Atom } from "../Atom";
import { AtomBinder } from "../core/AtomBinder";
import { AtomDisposableList } from "../core/AtomDisposableList";
import { AtomWatcher } from "../core/AtomWatcher";
import { BindableProperty } from "../core/BindableProperty";
import { IDisposable } from "../core/types";
import { Inject } from "../di/Inject";
import { IAtomViewModel, registerInit, viewModelInitFunc } from "./baseTypes";

function runDecoratorInits(): void {
    const v: any = this.constructor.prototype;
    if (!v) {
        return;
    }
    const ris: Array<(a: any, b: any) => void> = v._$_inits;
    if (ris) {
        for (const ri of ris) {
            ri.call(this, this);
        }
    }
}

async function privateInit(): Promise<any> {
    try {
        await Atom.postAsync(this.app, async () => {
            runDecoratorInits.apply(this);
            // this.registerWatchers();
        });
        await Atom.postAsync(this.app, async () => {
            await this.init();
            this.onReady();
        });

        if (this.postInit) {
            for (const i of this.postInit) {
                i();
            }
            this.postInit = null;
        }
    } finally {
        const pi = this.pendingInits;
        this.pendingInits = null;
        for (const iterator of pi) {
            iterator();
        }
    }
}

/**
 * Useful only for Unit testing, this function will await till initialization is
 * complete and all pending functions are executed
 */
export async function waitForReady(vm: AtomViewModel): Promise<any> {
    while ((vm as any).pendingInits) {
        await Atom.delay(100);
    }
}

/**
 * ViewModel class supports initialization and supports {@link IDisposable} dispose pattern.
 * @export
 * @class AtomViewModel
 */
export class AtomViewModel {

    // tslint:disable-next-line:ban-types
    public postInit: Function[];

    private disposables: AtomDisposableList = null;

    private validations: Array<{ name: string, initialized: boolean, watcher: AtomWatcher<AtomViewModel>}> = [];

    private pendingInits: Array<() => void> = [];

    /**
     * If it returns true, it means all pending initializations have finished
     */
    public get isReady(): boolean {
        return this.pendingInits === null;
    }

    public get errors(): Array<{ name: string, error: string}> {
        const e: Array<{ name: string, error: string}> = [];
        if (!this.mShouldValidate) {
            return e;
        }
        for (const v of this.validations) {
            if (!v.initialized) {
                return e;
            }
            const error = this [v.name];
            if (error) {
                e.push( { name: v.name, error});
            }
        }
        return e;
    }

    private mChildren: AtomViewModel[];
    private mParent: AtomViewModel;
    private mShouldValidate: boolean = false;

    /**
     * Returns parent AtomViewModel if it was initialized with one. This property is also
     * useful when you open an popup or window. Whenever a popup/window is opened, ViewModel
     * associated with the UI element that opened this popup/window becomes parent of ViewModel
     * of popup/window.
     */
    public get parent(): AtomViewModel {
        return this.mParent;
    }
    public set parent(v: AtomViewModel) {
        if (this.mParent && this.mParent.mChildren) {
            this.mParent.mChildren.remove(this);
        }
        this.mParent = v;
        if (v) {
            const c = v.mChildren || (v.mChildren = []);
            c.add(this);
            this.registerDisposable({
                dispose: () => {
                    c.remove(this);
                }
            });
        }
    }

    /**
     * Returns true if all validations didn't return any error. All validations
     * are decorated with @{@link Validate} decorator.
     */
    public get isValid(): boolean {
        let valid = true;
        const validateWasFalse = this.mShouldValidate === false;
        this.mShouldValidate = true;
        for (const v of this.validations) {
            if (!v.initialized) {
                v.watcher.init(true);
                v.initialized = true;
            }
            if (this[v.name]) {
                if (validateWasFalse) {
                    AtomBinder.refreshValue(this, v.name);
                }
                valid = false;
            }
        }
        if (this.mChildren) {
            for (const child of this.mChildren) {
                if (!child.isValid) {
                    valid = false;
                }
            }
        }
        AtomBinder.refreshValue(this, "errors");
        return valid;
    }

    constructor(@Inject public readonly app: App) {
        this.app.runAsync(() => privateInit.apply(this));
    }

    /**
     * Resets validations and all errors are removed.
     * @param resetChildren reset child view models as well. Default is true.
     */
    public resetValidations(resetChildren: boolean = true): void {
        this.mShouldValidate = false;
        for (const v of this.validations) {
            this.refresh(v.name);
        }
        if (resetChildren && this.mChildren) {
            for (const iterator of this.mChildren) {
                iterator.resetValidations(resetChildren);
            }
        }
    }

    /**
     * Runs function after initialization is complete.
     * @param f function to execute
     */
    public runAfterInit(f: () => void): void {
        if (this.pendingInits) {
            this.pendingInits.push(f);
            return;
        }
        f();
    }

    // /**
    //  * Binds source property to target property with optional two ways
    //  * @param target target whose property will be set
    //  * @param propertyName name of target property
    //  * @param source source to read property from
    //  * @param path property path of source
    //  * @param twoWays optional, two ways {@link IValueConverter}
    //  */
    // public bind(
    //     target: any,
    //     propertyName: string,
    //     source: any,
    //     path: string[][],
    //     twoWays?: IValueConverter | ((v: any) => any) ): IDisposable {
    //     const pb = new PropertyBinding(
    //         target,
    //         null,
    //         propertyName,
    //         path,
    //         (twoWays && typeof twoWays !== "function") ? true : false , twoWays, source);
    //     return this.registerDisposable(pb);
    // }

    /**
     * Refreshes bindings associated with given property name
     * @param name name of property
     */
    public refresh(name: string): void {
        AtomBinder.refreshValue(this, name);
    }

    /**
     * Put your asynchronous initialization here
     *
     * @returns {Promise<any>}
     * @memberof AtomViewModel
     */
    // tslint:disable-next-line:no-empty
    public async init(): Promise<any> {
    }

    /**
     * dispose method will be called when attached view will be disposed or
     * when a new view model will be assigned to view, old view model will be disposed.
     *
     * @memberof AtomViewModel
     */
    public dispose(): void {
        if (this.disposables) {
            this.disposables.dispose();
        }
    }

    // /**
    //  * Internal method, do not use, instead use errors.hasErrors()
    //  *
    //  * @memberof AtomViewModel
    //  */
    // public runValidation(): void {
    //     for (const v of this.validations) {
    //         v.watcher.evaluate(true);
    //     }
    // }

    /**
     * Register a disposable to be disposed when view model will be disposed.
     *
     * @protected
     * @param {IDisposable} d
     * @memberof AtomViewModel
     */
    public registerDisposable(d: IDisposable): IDisposable {
        this.disposables = this.disposables || new AtomDisposableList();
        return this.disposables.add(d);
    }

    // tslint:disable-next-line:no-empty
    protected onReady(): void {}

    /**
     * Execute given expression whenever any bindable expression changes
     * in the expression.
     *
     * For correct generic type resolution, target must always be `this`.
     *
     *      this.setupWatch(() => {
     *          if(!this.data.fullName){
     *              this.data.fullName = `${this.data.firstName} ${this.data.lastName}`;
     *          }
     *      });
     *
     * @protected
     * @template T
     * @param {() => any} ft
     * @returns {IDisposable}
     * @memberof AtomViewModel
     */
    protected setupWatch(
        ft: string[][] | (() => any),
        proxy?: (...v: any[]) => void,
        forValidation?: boolean,
        name?: string): IDisposable {

        const d: AtomWatcher<any> = new AtomWatcher<any>(
            this, ft, proxy, this );
        if (forValidation) {
            this.validations = this.validations || [];
            this.validations.push({ name, watcher: d, initialized: false});
        } else {
            d.init();
        }
        return this.registerDisposable(d);
    }

    // tslint:disable-next-line:no-empty
    protected onPropertyChanged(name: string): void {}

}

/**
 * Receive messages for given channel
 * @param {(string | RegExp)} channel
 * @returns {Function}
 */
export function Receive(...channel: string[]): viewModelInitFunc {
    return (target: AtomViewModel, key: string | symbol): void => {
        registerInit(target, (vm) => {
            // tslint:disable-next-line:ban-types
            const fx: Function = (vm as any)[key];
            const a: AtomAction = (ch: string, d: any): void => {
                const p = fx.call(vm, ch, d );
                if (p && p.then && p.catch) {
                    p.catch((e) => {
                        // tslint:disable-next-line: no-console
                        console.warn(e);
                    });
                }
            };
            const ivm = vm as AtomViewModel;
            for (const c of channel) {
                ivm.registerDisposable(ivm.app.subscribe(c, a));
            }
        });
    };
}

export function BindableReceive(...channel: string[]): viewModelInitFunc {
    return (target: AtomViewModel, key: string | symbol): void => {
        const bp: any = BindableProperty(target, key as string);

        registerInit(target, (vm) => {
            const fx: AtomAction = (cx: string, m: any) => {
                vm[key] = m;
            };
            const ivm = vm as AtomViewModel;
            for (const c of channel) {
                ivm.registerDisposable(ivm.app.subscribe(c, fx));
            }
        });

        return bp;
    };
}

export function BindableBroadcast(...channel: string[]): viewModelInitFunc {
    return (target: AtomViewModel, key: string | string): void => {
        const bp: any = BindableProperty(target, key as string);

        registerInit(target, (vm) => {
            const fx: (t: any) => any = (t: any): any => {
                const v: any = vm[key];
                for (const c of channel) {
                    vm.app.broadcast(c, v);
                }
            };
            const d: AtomWatcher<any> = new AtomWatcher<any>(vm, [key.split(".")], fx );
            d.init();

            vm.registerDisposable(d);
        });

        return bp;
    };

}

export function Watch(target: AtomViewModel, key: string | symbol, descriptor: any): void {

    registerInit(target, (vm) => {

        const ivm = (vm as any) as IAtomViewModel;
        if (descriptor && descriptor.get) {
            ivm.setupWatch(descriptor.get, () => {
                vm.refresh(key.toString());
            });
            return;
        }

        ivm.setupWatch(vm[key]);
    });
}

/**
 * Cached watch must be used with async getters to avoid reloading of
 * resources unless the properties referenced are changed
 * @param target ViewModel
 * @param key name of property
 * @param descriptor descriptor of property
 */
export function CachedWatch(target: AtomViewModel, key: string, descriptor: any): void {

    const getMethod = descriptor.get;

    descriptor.get = (() => null);

    registerInit(target, (vm) => {
        const ivm = (vm as any) as IAtomViewModel;

        const fieldName = `_${key}`;

        Object.defineProperty(ivm, key, {
            enumerable: true,
            configurable: true,
            get() {
                const c =
                    ivm[fieldName] || (
                        ivm[fieldName] = {
                            value: getMethod.apply(ivm)
                        }
                    );
                return c.value;
            }
        });

        ivm.setupWatch(getMethod, () => {
            ivm[fieldName] = null;
            AtomBinder.refreshValue(ivm, key);
        });
    });
}

export function Validate(target: AtomViewModel, key: string | symbol, descriptor: any): void {

    // tslint:disable-next-line:ban-types
    const getMethod = descriptor.get as (() => any);

    // // trick is to change property descriptor...
    // delete target[key];

    descriptor.get = () => null;

    // // replace it with dummy descriptor...
    // Object.defineProperty(target, key, descriptor);

    registerInit(target, (vm) => {
        const initialized = { i: false };
        const ivm = (vm as any) as IAtomViewModel;

        Object.defineProperty(ivm, key, {
            enumerable: true,
            configurable: true,
            get() {
                if ((vm as any).mShouldValidate && initialized.i) {
                    return getMethod.apply(this);
                }
                return null;
            }
        });

        ivm.setupWatch(getMethod, () => {
            // descriptor.get = getMethod;

            // Object.defineProperty(target, key, descriptor);
            initialized.i = true;
            vm.refresh(key.toString());
        }, true, key.toString());
        return;
    });

}
