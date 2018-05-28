export interface INativeComponent {
}
export declare class AtomElementExtensions {
    static addEventHandler(target: INativeComponent, handler: EventListenerOrEventListenerObject): void;
    static removeEventHandler(target: INativeComponent, handler: EventListenerOrEventListenerObject): void;
}
export declare type IAtomElement = HTMLElement | INativeComponent;
export interface NameValuePairs {
    [key: string]: any;
}
export interface NameValues {
    [key: string]: (string | number | boolean);
}
export interface IDisposable {
    dispose(): void;
}
export declare class AtomDisposable implements IDisposable {
    private f;
    /**
     *
     */
    constructor(f: Function);
    dispose(): void;
}
