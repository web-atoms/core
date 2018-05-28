import { IAtomElement, IDisposable } from "./types";
export declare class AtomComponent {
    [key: string]: any;
    private eventHandlers;
    private bindings;
    bind(element: IAtomElement, name: string, path: string[], twoWays: boolean): IDisposable;
    bindEvent(element: IAtomElement, name?: string, method?: EventListenerOrEventListenerObject, key?: string): void;
    unbindEvent(element: HTMLElement, name?: string, method?: EventListenerOrEventListenerObject, key?: string): void;
    init(): void;
    dispose(e?: IAtomElement): void;
}
