export interface INativeComponent {
}
export declare type IAtomElement = HTMLElement | INativeComponent;
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
export declare class ArrayHelper {
    static remove<T>(a: T[], filter: (item: T) => boolean): boolean;
}
