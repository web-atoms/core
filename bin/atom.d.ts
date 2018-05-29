import * as WebAtoms from "./core/types";
export declare class Atom {
    static encodeParameters(p: WebAtoms.INameValuePairs): string;
    static url(url: string, query?: WebAtoms.INameValuePairs, hash?: WebAtoms.INameValuePairs): string;
    static watch(): WebAtoms.AtomDisposable;
}
