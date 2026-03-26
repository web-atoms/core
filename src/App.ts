import { AtomBinder } from "./core/AtomBinder.js";
import { AtomDispatcher } from "./core/AtomDispatcher.js";
import { AtomUri } from "./core/AtomUri.js";
import { IScreen } from "./core/IScreen.js";
import { CancelToken, IDisposable } from "./core/types.js";
import { RegisterSingleton } from "./di/RegisterSingleton.js";
import { ServiceProvider } from "./di/ServiceProvider.js";
import { BusyIndicatorService, IBackgroundTaskInfo } from "./services/BusyIndicatorService.js";

import "./core/AtomList.js";
import "@web-atoms/date-time/dist/DateTime.js";
import "@web-atoms/date-time/dist/TimeSpan.js";


// declare var UMD: any;

export type AtomAction = (channel: string, data: any) => void;

class AtomHandler {

    public message: string;
    public list: AtomAction[];

    constructor(message: string) {
        this.message = message;
        this.list = new Array<AtomAction>();
    }

}

export class AtomMessageAction {
    public message: string;
    public action: AtomAction;

    constructor(msg: string, a: AtomAction) {
        this.message = msg;
        this.action = a;
    }
}

export interface IAuthorize {
    authorize: string[] | boolean;
    authorized: boolean;
}

const { head } = document;

const addMarker = (name) => {
    const e = document.createElement("meta");
    e.setAttribute("name", name);
    return e;
}

const markers = {
    "global-high": head.insertAdjacentElement("afterbegin", addMarker("global-high")),
    global: head.insertAdjacentElement("afterbegin", addMarker("global")),
    "global-low": head.insertAdjacentElement("afterbegin", addMarker("global-low")),
    "local-low": head.insertAdjacentElement("beforeend", addMarker("local-low")),
    local: head.insertAdjacentElement("beforeend", addMarker("local")),
    "local-high": head.insertAdjacentElement("beforeend", addMarker("local-high")),
};

@RegisterSingleton
export class App extends ServiceProvider {

    public static installStyleSheet(ssConfig: string |
        { href: string, integrity?: string, crossOrigin?: string}): void {

        if (typeof ssConfig !== "object") {
            ssConfig = { href: ssConfig };
        }

        // ssConfig.href = UMD.resolvePath(ssConfig.href);
        const links = document.getElementsByTagName("link");
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < links.length; index++) {
            const element = links[index];
            const href = element.getAttribute("href");
            if (href === ssConfig.href) {
                return;
            }
        }
        const ss = document.createElement("link");
        ss.rel = "stylesheet";
        ss.href = ssConfig.href;
        if (ssConfig.crossOrigin) {
            ss.crossOrigin = ssConfig.crossOrigin;
        }
        if (ssConfig.integrity) {
            ss.integrity = ssConfig.integrity;
        }

        const matches = /((global|local)(\-(high|low))?)\.css/.exec(ss.href);
        if (matches) {
            const m = matches[1];
            if (m) {
                const marker = markers[m] as HTMLElement;
                if (marker) {
                    marker.insertAdjacentElement("afterend", ss);
                    return;
                }
            }
        }
        document.head.appendChild(ss);
    }

    public static installScript(location: string) {
        // location = UMD.resolvePath(location);
        const links = document.getElementsByTagName("script");
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < links.length; index++) {
            const element = links[index];
            const href = element.getAttribute("src");
            if (href === location) {
                return (element as any).loaderPromise;
            }
        }
        const script: HTMLScriptElement = document.createElement("script");
        const p = new Promise<void>((resolve, reject) => {
            script.type = "text/javascript";
            script.src = location;
            const s: any = script as any;
            script.onload = s.onreadystatechange = () => {
                if ((s.readyState && s.readyState !== "complete" && s.readyState !== "loaded")) {
                    return;
                }
                script.onload = s.onreadystatechange = null;
                resolve();
            };
            document.body.appendChild(script);
        });
        (script as any).loaderPromise = p;
        return p;
    }

    public static authorize(authorize: string[] | boolean = true) {
        const detail: IAuthorize = {
            authorize,
            authorized: true
        };
        const ce = new CustomEvent("authorize", {
            bubbles: true,
            detail
        });
        document.body.dispatchEvent(ce);
        if (!ce.detail.authorized) {
            return false;
        }
        return true;
    }

    public static current: App;

    public readonly dispatcher: AtomDispatcher;

    public readonly screen: IScreen;

    /**
     * This must be set explicitly as it can be used outside to detect
     * if app is ready. This will not be set automatically by framework.
     */
    public appReady: boolean = false;

    private bag: any;

    private busyIndicatorService: BusyIndicatorService;
    // tslint:disable-next-line:ban-types
    private readyHandlers: Array<() => any> = [];

    private mUrl: AtomUri;
    public get url(): AtomUri {
        return this.mUrl;
    }

    public set url(v: AtomUri) {
        this.mUrl = v;
        AtomBinder.refreshValue(this, "url");
    }

    public get contextId(): string {
        return "none";
    }

    constructor() {
        super(null);
        App.current = this;
        this.screen = {};
        this.bag = {};
        this.put(App, this);
        this.dispatcher = new AtomDispatcher();
        this.dispatcher.start();
        this.put(AtomDispatcher, this.dispatcher);
        setTimeout(() => {
            this.invokeReady();
        }, 5);
    }

    public createBusyIndicator(taskInfo?: IBackgroundTaskInfo ): Disposable {
        this.busyIndicatorService = this.busyIndicatorService
            || this.resolve(BusyIndicatorService);
        return this.busyIndicatorService.createIndicator(taskInfo);
    }

    public syncUrl(): void {
        // must be implemented by platform specific app
    }

    public callLater(f: () => void) {
        this.dispatcher.callLater(f);
    }

    public installStyleSheet(ssConfig: string |
        { href: string, integrity?: string, crossOrigin?: string}): void {

        App.installStyleSheet(ssConfig);
    }

    public installScript(location: string) {
        return App.installScript(location);
    }

    public updateDefaultStyle(content: string) {
        throw new Error("Platform does not support StyleSheets");
    }

    public waitForPendingCalls(): Promise<any> {
        return this.dispatcher.waitForAll();
    }

    public setTimeoutAsync(
        task: () => Promise<any>,
        timeInMS: number = 1,
        previousToken?: number) {
        if (previousToken !== void 0) {
            clearTimeout(previousToken);
        }
        return setTimeout(() => {
            try {
                const p = task();
                if (p?.then) {
                    p.catch((error) => {
                        if (CancelToken.isCancelled(error)) {
                            return;
                        }
                        // tslint:disable-next-line: no-console
                        console.error(error);
                    });
                }
            } catch (e) {
                if (CancelToken.isCancelled(e)) {
                    return;
                }
                // tslint:disable-next-line: no-console
                console.error(e);
            }
        }, timeInMS);
    }

    /**
     * This method will run any asynchronous method
     * and it will display an error if it will fail
     * asynchronously
     *
     * @template T
     * @param {() => Promise<T>} tf
     * @memberof AtomDevice
     */
    public runAsync<T>(tf: () => Promise<T>): void {
        try {
            const p = tf();
            if (p && p.then && p.catch) {
                p.catch((error) => {
                    this.onError("runAsync");
                    this.onError(error);
                });
            }
        } catch (e) {
            this.onError("runAsync");
            this.onError(e);
        }
    }

    public onError: (m: any) => void = (error) => {
        // tslint:disable-next-line:no-console
        console.log(error);
    }

    /**
     * Broadcast given data to channel, only within the current window.
     *
     * @param {string} channel
     * @param {*} data
     * @returns
     * @memberof AtomDevice
     */
    public broadcast(channel: string, data: any): void {
        const ary: AtomHandler = this.bag[channel] as AtomHandler;
        if (!ary) {
            return;
        }
        for (const entry of ary.list) {
            entry.call(this, channel, data);
        }
    }

    /**
     * Subscribe for given channel with action that will be
     * executed when anyone will broadcast (this only works within the
     * current browser window)
     *
     * This method returns a disposable, when you call `.dispose()` it will
     * unsubscribe for current subscription
     *
     * @param {string} channel
     * @param {AtomAction} action
     * @returns {AtomDisposable} Disposable that supports removal of subscription
     * @memberof AtomDevice
     */
    public subscribe(channel: string, action: AtomAction): IDisposable {
        let ary: AtomHandler = this.bag[channel] as AtomHandler;
        if (!ary) {
            ary = new AtomHandler(channel);
            this.bag[channel] = ary;
        }
        ary.list.push(action);
        return {
            dispose: () => {
                ary.list = ary.list.filter((a) => a !== action);
                if (!ary.list.length) {
                    this.bag[channel] = null;
                }
            }
        };
    }

    public main(): void {
        // load app here..
    }

    // tslint:disable-next-line:no-empty
    protected onReady(f: () => any): void {
        if (this.readyHandlers) {
            this.readyHandlers.push(f);
        } else {
            this.invokeReadyHandler(f);
        }
    }

    protected invokeReady(): void {
        if (this.invokeReadyHandler) {
            for (const iterator of this.readyHandlers) {
                this.invokeReadyHandler(iterator);
            }
        }
        this.readyHandlers = null;
    }

    // tslint:disable-next-line:ban-types
    private invokeReadyHandler(f: () => any): void {

        const indicator = this.createBusyIndicator();
        const a = f();
        if (a && a.then && a.catch) {
            a.then((r) => {
                // do nothing
                indicator[Symbol.dispose]();
            });
            a.catch((e) => {
                indicator[Symbol.dispose]();
                // tslint:disable-next-line:no-console
                // console.error("XFApp.onReady");
                // tslint:disable-next-line:no-console
                console.error(typeof e === "string" ? e : JSON.stringify(e));
            });
            return;
        }
        indicator[Symbol.dispose]();
    }

}

const ESMPack = ((window as any).ESMPack ??= {})
ESMPack.render = async (imports, element: HTMLElement) => {
    const app = new App();
    if (typeof imports === "string") {
        imports = await import(imports);
    }
    const c = new imports.default(app);
    element.replaceWith(c.element);
};

ESMPack.installStyleSheet = App.installStyleSheet;
