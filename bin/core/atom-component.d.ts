export declare class AtomComponent {
    [key: string]: any;
    private eventHandlers;
    bindEvent(element: HTMLElement, name?: string, method?: EventListenerOrEventListenerObject, key?: string): void;
    unbindEvent(element: HTMLElement, name?: string, method?: EventListenerOrEventListenerObject, key?: string): void;
    init(): void;
    dispose(e?: HTMLElement): void;
}
