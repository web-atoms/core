import * as WebAtoms from "./core/types";
export declare class Atom {
    static encodeParameters(p: WebAtoms.NameValuePairs): string;
    static url(url: string, query?: WebAtoms.NameValuePairs, hash?: WebAtoms.NameValuePairs): string;
    static watch(): WebAtoms.AtomDisposable;
}
