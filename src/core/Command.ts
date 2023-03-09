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
        cmd.eventScope.dispatchEvent(commandParameter);
    }

});

let id = 1;

export default class Command<T = any> {

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

    public listen(r: { app: App, registerDisposable: (d: IDisposable) => void }, handler: (ce: CustomEvent<T>) => any) {
        const d = this.eventScope.listen((e) => {
            r.app.runAsync(() => handler(e));
        });
        return r.registerDisposable(d);
    }

    public dispatch(detail?: T, cancelable?: boolean) {
        this.eventScope.dispatchEvent(detail, cancelable);
    }
}