import * as WebAtoms from "./core/types";
export declare class Atom {
    encodeParameters(p: WebAtoms.INameValuePairs): string;
    url(url: string, query?: WebAtoms.INameValuePairs, hash?: WebAtoms.INameValuePairs): string;
    watch(): WebAtoms.AtomDisposable;
}
