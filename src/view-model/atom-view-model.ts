import { Atom } from "../atom";
import { AtomBinder, AtomDisposable, AtomWatcher, bindableProperty, IDisposable } from "../core";
import { AtomAction, AtomDevice } from "../core/atom-device";
import { Inject } from "../di";

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

    private validations: Array<AtomWatcher<AtomViewModel>> = [];

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

    private mIsReady: boolean = false;

    public get isReady(): boolean {
        return this.mIsReady;
    }

    constructor(@Inject() protected device: AtomDevice) {

        this.device.runAsync(() => this.privateInit());

    }

    public refresh(name: string): void {
        AtomBinder.refreshValue(this, name);
    }

    public async waitForReady(): Promise<any> {
        while (!this.mIsReady) {
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

    /**
     * Internal method, do not use, instead use errors.hasErrors()
     *
     * @memberof AtomViewModel
     */
    public runValidation(): void {
        for (const v of this.validations) {
            v.evaluate(true);
        }
    }

    /**
     * Register a disposable to be disposed when view model will be disposed.
     *
     * @protected
     * @param {IDisposable} d
     * @memberof AtomViewModel
     */
    public registerDisposable(d: IDisposable): void {
        this.disposables = this.disposables || [];
        this.disposables.push(d);
    }
    /**
     * Broadcast given data to channel (msg)
     *
     * @param {string} msg
     * @param {*} data
     * @memberof AtomViewModel
     */
    public broadcast(msg: string, data: any): void {
        this.device.broadcast(this.channelPrefix + msg, data);
    }

    // tslint:disable-next-line:no-empty
    protected onReady(): void {}

    /**
     * Adds validation expression to be executed when any bindable expression is updated.
     *
     * `target` must always be set to `this`.
     *
     *      this.addValidation(() => {
     *          this.errors.nameError = this.data.firstName ? "" : "Name cannot be empty";
     *      });
     *
     * Only difference here is, validation will not kick in first time, where else watch will
     * be invoked as soon as it is setup.
     *
     * Validation will be invoked when any bindable property in given expression is updated.
     *
     * Validation can be invoked explicitly only by calling `errors.hasErrors()`.
     *
     * @protected
     * @template T
     * @param {() => any} ft
     * @returns {IDisposable}
     * @memberof AtomViewModel
     */
    protected addValidation(...fts: Array<() => any>): IDisposable {

        const ds: IDisposable[] = [];

        for (const ft of fts) {
            const d: AtomWatcher<any> = new AtomWatcher<any>(this, ft, false, true);
            this.validations.push(d);
            this.registerDisposable(d);
            ds.push(d);
        }
        return new AtomDisposable(() => {
            this.disposables = this.disposables.filter( (f) => !ds.find((fd) => f === fd) );
            for (const dispsoable of ds) {
                dispsoable.dispose();
            }
        });
    }

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
    protected setupWatch(...fts: Array<() => any>): IDisposable {

        const dfd: IDisposable[] = [];
        for (const ft of fts) {
            const d: AtomWatcher<any> = new AtomWatcher<any>(this, ft, this.mIsReady );
            // debugger;
            this.registerDisposable(d);
            dfd.push(d);

            if (!this.mIsReady) {
                this.postInit = this.postInit || [];
                this.postInit.push(() => {
                    d.runEvaluate();
                });
            }
        }
        return new AtomDisposable(() => {
            this.disposables = this.disposables.filter( (f) => ! dfd.find((fd) => f === fd) );
            for (const disposable of dfd) {
                disposable.dispose();
            }
        });
    }

    // tslint:disable-next-line:no-empty
    protected onPropertyChanged(name: string): void {}

    /**
     * Register listener for given message.
     *
     * @protected
     * @template T
     * @param {string} msg
     * @param {(data: T) => void} a
     * @memberof AtomViewModel
     */
    protected onMessage<T>(msg: string, a: (data: T) => void): void {

        // tslint:disable-next-line:no-console
        console.warn("Do not use onMessage, instead use @receive decorator...");

        const action: AtomAction = (m, d) => {
            a(d as T);
        };
        const sub: IDisposable = this.device.subscribe( this.channelPrefix + msg, action);
        this.registerDisposable(sub);
    }

    private subscribe(channel: string, c: (ch: string, data: any) => void): void {
        const sub: IDisposable = this.device.subscribe( this.channelPrefix + channel, c);
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
            this.mIsReady = true;
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

/**
 * AtomErrors class holds all validation errors registered in view model.
 *
 * hasErrors() method will return true if there are any validation errors in this AtomErrors object.
 *
 * @export
 * @class AtomErrors
 */
export class AtomErrors {

    private static isInternal = /^\_(\_target|\$\_)/;

    private mTarget: AtomViewModel;

    /**
     * Creates an instance of AtomErrors.
     * @param {AtomViewModel} target
     * @memberof AtomErrors
     */
    constructor(target: AtomViewModel) {
        this.mTarget = target;
    }

    /**
     *
     *
     * @returns {boolean}
     * @memberof AtomErrors
     */
    public hasErrors(): boolean {

        if (this.mTarget) {
            this.mTarget.runValidation();
        }

        for (const k in this) {
            if (AtomErrors.isInternal.test(k)) {
                continue;
            }
            if (this.hasOwnProperty(k)) {
                if (this[k]) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     *
     *
     * @memberof AtomErrors
     */
    public clear(): void {
        for (const k in this) {
            if (AtomErrors.isInternal.test(k)) {
                continue;
            }
            if (this.hasOwnProperty(k)) {
                this[k] = null;
                AtomBinder.refreshValue(this, k);
            }
        }
    }

}

type viewModelInit = (vm: AtomViewModel) => void;

type viewModelInitFunc = (target: AtomViewModel, key: string | symbol) => void;

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
function receive(...channel: string[]): viewModelInitFunc {
    return (target: AtomViewModel, key: string | symbol): void => {
        registerInit(target, (vm) => {
            // tslint:disable-next-line:ban-types
            const fx: Function = (vm as any)[key];
            const a: AtomAction = (ch: string, d: any): void => {
                fx.call(vm, ch, d );
            };
            // tslint:disable-next-line:ban-types no-string-literal
            const s: Function = vm["subscribe"];
            for (const c of channel) {
                s.call(vm, c, a);
            }
        });
    };
}

function bindableReceive(...channel: string[]): viewModelInitFunc {
    return (target: AtomViewModel, key: string | symbol): void => {
        const bp: any = bindableProperty(target, key as string);

        registerInit(target, (vm) => {
            const fx: AtomAction = (cx: string, m: any) => {
                vm[key] = m;
            };
            // tslint:disable-next-line:ban-types no-string-literal
            const s: Function = vm["subscribe"];
            for (const c of channel) {
                s.call(vm, c, fx);
            }
        });

        return bp;
    };
}

function bindableBroadcast(...channel: string[]): viewModelInitFunc {
    return (target: AtomViewModel, key: string | string): void => {
        const bp: any = bindableProperty(target, key as string);

        registerInit(target, (vm) => {
            const fx: (t: any) => any = (t: any): any => {
                const v: any = vm[key];
                for (const c of channel) {
                    vm.broadcast(c, v);
                }
            };
            const d: AtomWatcher<any> = new AtomWatcher<any>(vm, [ key], false );
            d.func = fx;

            // tslint:disable-next-line:ban-types no-string-literal
            const f: Function = d["evaluatePath"];

            // tslint:disable-next-line:no-string-literal
            for (const p of d.path) {
                f.call(d, vm, p);
            }

            vm.registerDisposable(d);
        });

        return bp;
    };

}

function watch(target: AtomViewModel, key: string | symbol, descriptor: any): void {
    registerInit(target, (vm) => {
        // tslint:disable-next-line:ban-types no-string-literal
        const vfx: Function = vm["setupWatch"];
        vfx.call(vm, vm[key]);
    });
}

function validate(target: AtomViewModel, key: string | symbol, descriptor: any): void {
    registerInit(target, (vm) => {
        // tslint:disable-next-line:ban-types no-string-literal
        const vfx: Function = vm["addValidation"];
        // tslint:disable-next-line:no-string-literal
        vfx.call(vm, vm["key"]);
    });

}
