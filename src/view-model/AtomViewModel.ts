import { App, AtomAction } from "../App";
import { Atom } from "../Atom";
import { AtomBinder } from "../core/AtomBinder";
import { AtomDisposableList } from "../core/AtomDisposableList";
import { AtomOnce } from "../core/AtomOnce";
import { AtomUri } from "../core/AtomUri";
import { AtomWatcher } from "../core/AtomWatcher";
import { BindableProperty } from "../core/BindableProperty";
import { IValueConverter } from "../core/IValueConverter";
import { PropertyBinding } from "../core/PropertyBinding";
import { ArrayHelper, AtomDisposable, IClassOf, IDisposable } from "../core/types";
import { Inject } from "../di/Inject";

interface IVMSubscription {
    channel: string;
    action: AtomAction;
    disposable: IDisposable;
}

/**
 *
 *
 * @export
 * @class AtomViewModel
 * @extends {AtomModel}
 */
export class AtomViewModel {

    // tslint:disable-next-line:ban-types
    public postInit: Function[];

    private disposables: IDisposable[];

    private subscriptions: IVMSubscription[];

    private validations: Array<{ name: string, initialized: boolean, watcher: AtomWatcher<AtomViewModel>}> = [];

    private mChannelPrefix: string = "";
    public get channelPrefix(): string {
        return this.mChannelPrefix;
    }
    public set channelPrefix(v: string) {
        this.mChannelPrefix = v;

        const temp: IVMSubscription[] = this.subscriptions;
        if (temp) {
            this.subscriptions = [];
            for (const s of temp) {
                s.disposable.dispose();
            }
            for (const s1 of temp) {
                this.subscribe(s1.channel, s1.action);
            }
        }
        this.refresh("channelPrefix");
    }

    private pendingInits: Array<() => void> = [];

    public get isReady(): boolean {
        return this.pendingInits === null;
    }

    public get errors(): Array<{ name: string, error: string}> {
        const e: Array<{ name: string, error: string}> = [];
        for (const v of this.validations) {
            if (!v.initialized) {
                v.watcher.evaluate(true);
                v.initialized = true;
            }
            const error = this [v.name];
            if (error) {
                e.push( { name: v.name, error});
            }
        }
        return e;
    }

    public get isValid(): boolean {
        let valid = true;
        for (const v of this.validations) {
            if (!v.initialized) {
                v.watcher.evaluate(true);
                v.initialized = true;
            }
            if (this[v.name]) {
                valid = false;
            }
        }
        AtomBinder.refreshValue(this, "errors");
        return valid;
    }

    constructor(@Inject public readonly app: App) {
        this.app.runAsync(() => this.privateInit());
    }

    public runAfterInit(f: () => void): void {
        if (this.pendingInits) {
            this.pendingInits.push(f);
            return;
        }
        f();
    }

    public resolve<T>(c: IClassOf<T>, onlyRegistered?: boolean): T {
        const create = !onlyRegistered;
        return this.app.resolve(c, create);
    }

    public bind(propertyName: string, target: any, path: string[][], vc: IValueConverter ): IDisposable {
        const pb = new PropertyBinding(this, null, propertyName, path, true, vc, target);
        return this.registerDisposable(pb);
    }

    public refresh(name: string): void {
        AtomBinder.refreshValue(this, name);
    }

    public async waitForReady(): Promise<any> {
        while (this.pendingInits) {
            await Atom.delay(100);
        }
    }

    /**
     * Put your asynchronous initializations here
     *
     * @returns {Promise<any>}
     * @memberof AtomViewModel
     */
    // tslint:disable-next-line:no-empty
    public async init(): Promise<any> {
    }

    /**
     * dispose method will becalled when attached view will be disposed or
     * when a new view model will be assigned to view, old view model will be disposed.
     *
     * @memberof AtomViewModel
     */
    public dispose(): void {
        if (this.disposables) {
            for (const d of this.disposables) {
                d.dispose();
            }
        }
        if (this.subscriptions) {
            for (const d of this.subscriptions) {
                d.disposable.dispose();
            }
            this.subscriptions = null;
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
        this.disposables = this.disposables || [];
        this.disposables.push(d);
        return new AtomDisposable(() => {
            ArrayHelper.remove(this.disposables, (f) => f === d);
        });
    }
    /**
     * Broadcast given data to channel (msg)
     *
     * @param {string} msg
     * @param {*} data
     * @memberof AtomViewModel
     */
    public broadcast(msg: string, data: any): void {
        this.app.broadcast(this.channelPrefix + msg, data);
    }

    public bindUrlParameter(name: string, urlParameter: string): IDisposable {
        const a = this as any;
        const paramDisposables = (a.mUrlParameters || (a.mUrlParameters = {}));
        const old = paramDisposables[name];
        if (old) {
            old.dispose();
            paramDisposables[name] = null;
        }
        const disposables = new AtomDisposableList();
        const updater = new AtomOnce();
        disposables.add(this.setupWatch(
            [
                ["app", "url", "hash", name],
                ["app", "url", "query", name]
            ], (hash, query) => {
            updater.run(() => {
                const value = hash || query;
                this[name] = value;
            });
        }));
        disposables.add(this.setupWatch([[name]], (value) => {
            updater.run(() => {
                const url = this.app.url || (this.app.url = new AtomUri(""));
                url.hash[urlParameter] = value;
                this.app.syncUrl();
            });
        }));
        paramDisposables[name] = disposables;
        return disposables;
    }

    // tslint:disable-next-line:no-empty
    protected onReady(): void {}
    /**
     * Execute given expression whenever any bindable expression changes
     * in the expression.
     *
     * For correct generic type resolution, target must always be `this`.
     *
     *      this.watch(() => {
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
            this, ft, !forValidation && this.isReady, forValidation, proxy );

        this.registerDisposable(d);

        if (!forValidation) {
            this.runAfterInit(() => {
                d.runEvaluate();
            });
        } else {
            this.validations = this.validations || [];
            this.validations.push({ name, watcher: d, initialized: false});
        }
        return new AtomDisposable(() => {
            ArrayHelper.remove(this.disposables, (f) => f === d);
        });
    }

    // tslint:disable-next-line:no-empty
    protected onPropertyChanged(name: string): void {}

    // /**
    //  * Register listener for given message.
    //  *
    //  * @protected
    //  * @template T
    //  * @param {string} msg
    //  * @param {(data: T) => void} a
    //  * @memberof AtomViewModel
    //  */
    // protected onMessage<T>(msg: string, a: (data: T) => void): void {

    //     // tslint:disable-next-line:no-console
    //     console.warn("Do not use onMessage, instead use @receive decorator...");

    //     const action: AtomAction = (m, d) => {
    //         a(d as T);
    //     };
    //     const sub: IDisposable = this.app.subscribe( this.channelPrefix + msg, action);
    //     this.registerDisposable(sub);
    // }

    private subscribe(channel: string, c: (ch: string, data: any) => void): void {
        const sub: IDisposable = this.app.subscribe( this.channelPrefix + channel, c);
        this.subscriptions = this.subscriptions || [];
        this.subscriptions.push({
            channel,
            action: c,
            disposable: sub
        });
    }

    private async privateInit(): Promise<any> {
        try {
            await Atom.postAsync(async () => {
                this.runDecoratorInits();
                // this.registerWatchers();
            });
            await Atom.postAsync(async () => {
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

    private runDecoratorInits(): void {
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

}

interface IAtomViewModel {
    setupWatch(ft: () => any, proxy?: () => any, forValidation?: boolean, name?: string): IDisposable ;
    subscribe(channel: string, c: (ch: string, data: any) => void): void;
}

type viewModelInit = (vm: AtomViewModel) => void;

export type viewModelInitFunc = (target: AtomViewModel, key: string | symbol) => void;

function registerInit(target: AtomViewModel, fx: viewModelInit ): void {
    const t: any = target as any;
    const inits: viewModelInit[] = t._$_inits = t._$_inits || [];
    inits.push(fx);
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
                fx.call(vm, ch, d );
            };
            const ivm = (vm as any) as IAtomViewModel;
            for (const c of channel) {
                ivm.subscribe(c, a);
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
            const ivm = (vm as any) as IAtomViewModel;
            for (const c of channel) {
                ivm.subscribe(c, fx);
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
                    vm.broadcast(c, v);
                }
            };
            const d: AtomWatcher<any> = new AtomWatcher<any>(vm, [key.split(".")], false );
            d.func = fx;

            for (const p of d.path) {
                d.evaluatePath(vm, p);
            }

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

export function Validate(target: AtomViewModel, key: string | symbol, descriptor: any): void {

    // tslint:disable-next-line:ban-types
    const getMethod = descriptor.get as (() => any);

    // // trick is to change property descriptor...
    // delete target[key];

    descriptor.get = () => null;

    // // repalce it with dummy descriptor...
    // Object.defineProperty(target, key, descriptor);

    registerInit(target, (vm) => {
        const initialized = { i: false };
        const ivm = (vm as any) as IAtomViewModel;

        Object.defineProperty(ivm, key, {
            enumerable: true,
            configurable: true,
            get() {
                if (initialized.i) {
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

export function BindableUrlParameter(name: string): any {
    return (target: AtomViewModel, key: string | string, descriptor: PropertyDecorator): void => {
        registerInit(target, (vm) => {
            vm.bindUrlParameter(name, name);
        } );
        return BindableProperty(target, key);
    };
}
