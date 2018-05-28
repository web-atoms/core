export interface INativeComponent {
}
export declare type IAtomElement = HTMLElement | INativeComponent;
export declare class AtomElementExtensions {
    static addEventHandler: (target: INativeComponent, handler: EventListenerOrEventListenerObject) => void;
    static removeEventHandler: (target: INativeComponent, handler: EventListenerOrEventListenerObject) => void;
    static parent: (arg0: any) => any;
}
export interface INameValuePairs {
    [key: string]: any;
}
export interface INameValues {
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
