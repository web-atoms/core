import { AtomDispatcher } from "./atom-dispatcher";
import { AtomUI } from "./atom-ui";
import { AtomBridge } from "./bridge";
import { PropertyBinding } from "./property-binding";
import { AtomDisposable, IAtomElement, IDisposable } from "./types";

interface IEventObject {

    element: IAtomElement;

    name?: string;

    handler?: EventListenerOrEventListenerObject;

    key?: string;

    disposable?: IDisposable;

}
export class AtomComponent {

    [key: string]: any;

    private eventHandlers: IEventObject[] = [];

    private bindings: PropertyBinding[] = [];

    public bind(element: IAtomElement, name: string, path: string[], twoWays: boolean): IDisposable {

        // remove exisiting binding if any
        let binding = this.bindings.find( (x) => x.name === name && (element ? x.element === element : true));
        if (binding) {
            binding.dispose();
        }
        binding = new PropertyBinding(this, element, name, path, twoWays);
        this.bindings.push(binding);

        if (binding.twoWays) {
            binding.setupTwoWayBinding();
        }

        return new AtomDisposable(() => {
            this.bindings = this.bindings.filter( (x) => x !== binding);
        });
    }

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
        be.disposable = AtomBridge.instance.addEventHandler(element, name, method, false);
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
            be.disposable.dispose();
            be.handler = null;
            be.element = null;
            be.name = null;
            be.key = null;
            deleted.push(be);
        }
        this.eventHandlers = this.eventHandlers.filter( (x) => deleted.findIndex( (d) => d === x ) !== -1 );
    }

    public init(): void {
        // initialization used by derived controls
    }

    public dispose(e?: IAtomElement): void {
        if (e) {
            return;
        }
        this.unbindEvent(null, null, null);
        for (const binding of this.bindings) {
            binding.dispose();
        }
    }
}
