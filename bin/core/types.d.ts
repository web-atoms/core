export declare type NameValuePairs = {
    [key: string]: any;
};
export declare type NameValues = {
    [key: string]: (string | number | boolean);
};
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
