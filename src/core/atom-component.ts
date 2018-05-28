import { AtomUI } from "./atom-ui";

interface IEventObject {

    element: HTMLElement;

    name?: string;

    handler?: EventListenerOrEventListenerObject;

    key?: string;

}
export class AtomComponent {

    [key: string]: any;

    private eventHandlers: IEventObject[] = [];

    public bindEvent(
        element: HTMLElement,
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
        if (element.addEventListener) {
            element.addEventListener(name, method, false);
            this.eventHandlers.push(be);
        } else {
            throw new Error("Not supported");
        }
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
            be.element.removeEventListener(be.name, be.handler);
            deleted.push(be);
        }
        this.eventHandlers = this.eventHandlers.filter( (x) => deleted.findIndex( (d) => d === x ) !== -1 );
    }

    public init(): void {
        // initialization used by derived controls
    }

    public dispose(e?: HTMLElement): void {
        if (e) {
            return;
        }
        this.unbindEvent(null, null, null);
    }
}
