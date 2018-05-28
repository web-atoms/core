import { IAtomElement } from "./types";
export declare class AtomComponent {
    readonly isWebComponent: boolean;
    [key: string]: any;
    private eventHandlers;
    bindEvent(element: IAtomElement, name?: string, method?: EventListenerOrEventListenerObject, key?: string): void;
    unbindEvent(element: HTMLElement, name?: string, method?: EventListenerOrEventListenerObject, key?: string): void;
    init(): void;
    dispose(e?: HTMLElement): void;
}
