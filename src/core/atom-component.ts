import { AtomUI } from "./atom-ui";
import { IAtomElement, AtomElementExtensions } from "./types";

interface IEventObject {

    element: IAtomElement;

    name?: string;

    handler?: EventListenerOrEventListenerObject;

    key?: string;

}
export class AtomComponent {

    public readonly isWebComponent: boolean = true;

    [key: string]: any;

    private eventHandlers: IEventObject[] = [];

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
        if (element instanceof HTMLElement) {
            element.addEventListener(name, method, false);
        } else {
            AtomElementExtensions.addEventHandler(name, method);
        }
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
            if (be.element instanceof HTMLElement) {
                be.element.removeEventListener(be.name, be.handler);
            } else {
                AtomElementExtensions.removeEventHandler(name, method);
            }
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
