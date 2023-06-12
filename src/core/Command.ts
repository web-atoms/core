import type { App } from "../App";
import EventScope from "./EventScope";
import Route from "./Route";
import { StringHelper } from "./StringHelper";
import type { IDisposable } from "./types";

export const routeSymbol = Symbol("routeSymbol");

document.body.addEventListener("click", (ce: MouseEvent) => {
    let target = ce.target as HTMLElement;
    let clickCommand;
    let commandParameter;
    while (target) {
        clickCommand = target.dataset.clickCommand;
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

export default class Command<T = any, TR = any> {

    public static registry: Map<string, Command> = new Map();

    public static routes: Command[] = [];

    public static invokeRoute(route: string = location.hash.startsWith("#!")
        ? location.hash.substring(2)
        : location.pathname) {
        for (const iterator of this.routes) {
            const params = iterator.route.matches(route);
            if (params) {
                params[routeSymbol] = route;
                iterator.dispatch(params, true);
                return iterator;
            }
        }
    }

    public static create<TIn, TOut>({
        name = `command${id++}`,
        eventScope = EventScope.create<TIn>(),
        route,
        routeOrder = 0,
        registerOnClick
    }: {
        name?: string;
        eventScope?: EventScope<TIn>,
        route?: string;
        routeOrder?: number;
        registerOnClick?: (p: TIn) => any
    }) {
        return new Command<TIn, TOut>(name, eventScope, registerOnClick).withRoute(route, routeOrder);
    }

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

    public withRoute(route: string, order = 0) {
        this.routeObj = Route.create(route, order);
        Command.routes.push(this);
        Command.routes.sort((a, b) => a.route.order - b.route.order);
        return this;
    }

    public listen(r: { app: App, registerDisposable: (d: IDisposable) => void }, handler: (ce: CustomEventEx<T, TR>) => any) {
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
            const d = detail ??= {} as any;
            d[routeSymbol] ??= this.route.substitute(d);
        }
        this.eventScope.dispatchEvent(detail, cancelable);
    }

    public async dispatchAsync(detail?: T, cancelable?: boolean) {
        if (this.route) {
            const d = detail ??= {} as any;
            d[routeSymbol] ??= this.route.substitute(d);
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