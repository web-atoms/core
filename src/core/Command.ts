import type { App } from "../App";
import EventScope from "./EventScope";
import type { IDisposable } from "./types";

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

    public listen(r: { app: App, registerDisposable: (d: IDisposable) => void }, handler: (ce: CustomEventEx<T, TR>) => any) {
        const d = this.eventScope.listen((e) => {
            r.app.runAsync(async () => {
                const r = handler(e);
                const ce = e as any;
                ce.executed = true;
                ce.promise = r;
                if (r?.then) {
                    return await r;
                }
            });
        });
        return r.registerDisposable(d);
    }

    public dispatch(detail?: T, cancelable?: boolean) {
        this.eventScope.dispatchEvent(detail, cancelable);
    }

    public async dispatchAsync(detail?: T, cancelable?: boolean) {
        const ce = new CustomEvent(this.eventScope.eventName, { detail, cancelable}) as any as CustomEventEx<T, TR>;
        window.dispatchEvent(ce);
        if(ce.executed) {
            const promise = ce.promise;
            if (promise) {
                return await promise;
            }
        }
    }
}