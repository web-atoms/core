export declare type NameValuePair = {
    [key: string]: any;
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
