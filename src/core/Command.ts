import type { App } from "../App";
import type { AtomControl } from "../web/controls/AtomControl";
import EventScope from "./EventScope";
import Route from "./Route";
import { CancelToken, type IDisposable } from "./types";

export const routeSymbol = Symbol("routeSymbol");
export const displayRouteSymbol = Symbol("displayRouteSymbol");

document.body.addEventListener("click", (ce: MouseEvent) => {
    let target = ce.target as HTMLElement;
    let clickCommand;
    let commandParameter;
    while (target) {
        clickCommand = target.getAttribute("data-click-command");
        const cp = (target as any).commandParameter;
        if (cp) {
            commandParameter = cp;
        }
        if (clickCommand) {
            break;
        }
        target = target.parentElement;
    }

    if (!clickCommand) {
        return;
    }

    const cmd = Command.registry.get(clickCommand);
    if (cmd) {
        cmd.eventScope.dispatch(target, commandParameter);
    }

});

let id = 1;

export type CustomEventEx<T, TR> = CustomEvent<T> & {
    executed?: boolean;
    promise?: Promise<TR>;
    returnResult?: boolean;
};

export class PageCommands {
    public static pushPage: (page, parameters) => any;
    public static pushPageForResult: (page, parameters) => Promise<any>;
    public static openPage: (page, parameters) => any;
}

declare let UMD: any;

export type IPage<TIn, TOut> = {
    default: abstract new (... a: any[]) => {
        parameters: TIn;
        close(result: TOut): any;
    }
} | (abstract new (... a: any[]) => {
    parameters: TIn;
    close(result: TOut): any;
});


const defaultOrSelf = (x) => x?.default ?? x;

export default class Command<T = any, TR = any> {

    public static registry: Map<string, Command> = new Map();

    public static routes: Command[] = [];

    public static invokeRoute(route: string = location.hash.startsWith("#!")
        ? location.hash.substring(2)
        : location.pathname,
        forceDisplay = false) {

        let sp: URLSearchParams;

        if (/^http(s)?\:\/\//i.test(route)) {
            const url = new URL(route);
            sp = url.searchParams;
            route = url.hash.startsWith("#!") ? url.hash.substring(2) : url.pathname;
        } else {
            if (route.startsWith("#!")) {
                route = route.substring(2);
            }
        }

        const index = route.indexOf("?");
        if (index !== -1) {
            sp = new URLSearchParams(route.substring(index + 1));
            route = route.substring(0, index);
        } else {
            sp ??= new URLSearchParams("");
        }
        for (const iterator of this.routes) {
            const params = iterator.route.matches(route, sp);
            if (params) {
                params[routeSymbol] = route;
                params[displayRouteSymbol] = forceDisplay
                    ? (sp.size > 0 ? `${route}?${sp.toString()}` : route)
                    : "";
                iterator.dispatch(params, true);
                return iterator;
            }
        }
    }

    public static create<TIn = any, TOut = any>({
        name = `command${id++}`,
        eventScope = EventScope.create<TIn>(),
        route,
        routeQueries,
        routeOrder = 0,
        routeDefaults,
        pageLoader,
        pageListener,
        openPage,
        pushPage,
        registerOnClick,
        pushPageForResult,
        pushPageForResultOrCancel,
        listener
    }: {
        name?: string;
        eventScope?: EventScope<TIn>,
        route?: string;
        routeQueries?: string[],
        routeOrder?: number;
        routeDefaults?: Partial<TIn>,
        registerOnClick?: (p: TIn) => any,
        pageLoader?: (() => Promise<IPage<TIn, TOut>>),
        pageListener?: ((page: IPage<TIn, TOut>) => (ce: CustomEvent<TIn>) => any),
        openPage?: (() => Promise<IPage<TIn, TOut>>),
        pushPage?: (() => Promise<IPage<TIn, TOut>>),
        pushPageForResult?: (() => Promise<IPage<TIn, TOut>>),
        pushPageForResultOrCancel?: (() => Promise<IPage<TIn, TOut>>),
        listener?: ((ce: CustomEvent<TIn>) => any)
    }) {
        let cmd = new Command<TIn, TOut>(name, eventScope, registerOnClick)
        if(route) {
            cmd = cmd.withRoute(route, routeQueries, routeOrder, routeDefaults);
        }

        cmd.listener = listener;

        if (openPage) {
            let pageType: any;
            cmd.listener = async (ce) => { 
                const p = ce.detail ?? {};
                return p.returnResult
                ? PageCommands.pushPageForResult(pageType ??= defaultOrSelf(await openPage()), p)
                : PageCommands.openPage(pageType ??= defaultOrSelf(await openPage()), p);
            }
        }

        if (pushPage) {            
            let pageType: any;
            cmd.listener = async (ce) => {
                const p = ce.detail ?? {};
                return p.returnResult
                ? PageCommands.pushPageForResult(pageType ??= defaultOrSelf(await pushPage()), p)
                : PageCommands.pushPage(pageType ??= defaultOrSelf(await pushPage()), p);
            };
        }

        if (pushPageForResult) {
            let pageType: any;
            cmd.listener = async (ce) => PageCommands.pushPageForResult(pageType ??= defaultOrSelf(await pushPageForResult()), ce.detail ?? {});
        }

        if (pushPageForResultOrCancel) {
            let pageType: any;
            cmd.listener = async (ce) => {
                try {
                    return await PageCommands.pushPageForResult(pageType ??= defaultOrSelf(await pushPageForResultOrCancel()), ce.detail ?? {});
                } catch (e) {
                    if(CancelToken.isCancelled(e)) {
                        return;
                    }
                    console.error(e);
                }
            };
        }

        if (pageLoader) {
            let pageType: any;
            cmd.listener = async (ce) => {
                try {
                    pageType ??= defaultOrSelf(await pageLoader());
                    return pageListener(pageType)(ce);
                } catch (e) {
                    if (CancelToken.isCancelled(e)) {
                        return;
                    }
                    console.error(e);
                }
            };
        }

        return cmd;
    }

    private listener: (ce: CustomEvent) => any;

    /**
     * This name does not contain `event-` prefix
     */
    public get eventName() {
        return this.eventScope.eventType;
    }

    private routeObj: Route;
    public get route() {
        return this.routeObj;
    }

    public defaults?: any;

    constructor(
        public readonly name: string = `command${id++}`,
        public readonly eventScope: EventScope<T> = EventScope.create<T>(),
        public readonly registerOnClick = (p: T) => ({
            "data-click-command": this.name,
            "commandParameter": p
        })
    ) {
        Command.registry.set(this.name, this);
    }

    public displayRoute(p: Partial<T>, absoluteUrl = false) {
        let route = Route.encodeUrl(this.routeObj.substitute(p));
        if (absoluteUrl) {
            if (route.startsWith("#!")) {
                route = location.href.split("#")[0] + route;
            } else if(route.startsWith("/")) {
                route = location.protocol + "//" + location.host + route;
            }
        }
        return route;
    }

    public withRoute(route: string, queries?: string[], order = 0, defaults?: any) {
        this.routeObj = Route.create(route, queries, order);
        Command.routes.push(this);
        Command.routes.sort((a, b) => a.route.order - b.route.order);
        this.defaults = defaults;
        // document.body.addEventListener(this.eventName, (e: CustomEvent) => {
        //     try {
        //         const { detail } = e;
        //         let route = this.routeObj.substitute(detail);
        //         if (defaults) {
        //             for (const key in defaults) {
        //                 if (Object.prototype.hasOwnProperty.call(defaults, key)) {
        //                     const element = defaults[key];
        //                     if (detail[key] === void 0) {
        //                         detail[key] = element;
        //                     }
        //                 }
        //             }
        //         }
        //         e.detail[routeSymbol] = route;
        //         e.detail[displayRouteSymbol] = route;
        //     }catch (error) {
        //         console.error(error);
        //     }
        // }, true);
        return this;
    }

    public listen(
        r: { app: App, registerDisposable: (d: IDisposable) => void },
        handler: (ce: CustomEventEx<T, TR>) => any = this.listener) {
        if (!handler) {
            throw new Error("Handler must be specified...");
        }
        const d = this.eventScope.listen((e) => {
            const ce = e as CustomEventEx<any,any>;
            try {
                ce.executed = true;
                ce.promise = handler(e);
            } catch (error) {
                ce.promise = Promise.reject(error);
            }
            r.app.runAsync(() => ce.promise);
        });
        return r.registerDisposable(d);
    }

    public dispatch(detail?: T, cancelable?: boolean) {
        if (this.route) {
            detail = this.updateRoute(detail);
        }
        this.eventScope.dispatch(document.body, detail, { cancelable, bubbles: true });
    }

    private updateRoute(detail: T) {
        const d = detail ??= {} as any;
        let r = d[routeSymbol];
        if (r === null || r === void 0) {
            r = this.route.substitute(d);
            d[routeSymbol] = r;
            d[displayRouteSymbol] = r;
        }
        const { defaults } = this;
        if (defaults) {
            for (const key in defaults) {
                if (Object.prototype.hasOwnProperty.call(defaults, key)) {
                    const element = defaults[key];
                    if (d[key] === void 0) {
                        d[key] = element;
                    }
                }
            }
        }
        return detail;
    }

    public async dispatchAsync(detail?: T, cancelable?: boolean) {
        if (this.route) {
            detail = this.updateRoute(detail);
        }
        const ce = new CustomEvent(this.eventScope.eventType, { detail, cancelable}) as any as CustomEventEx<T, TR>;
        ce.returnResult = true;
        window.dispatchEvent(ce);
        if(ce.executed) {
            const promise = ce.promise;
            if (promise) {
                return await promise;
            }
        }
    }
}

export class Commands {

    protected static app: App;

    public static install(control: AtomControl) {
        this.app = control.app;
        for (const key in this) {
            const element = this[key];
            if (element instanceof Command) {
                element.listen(control);
            }
        }
    }

}