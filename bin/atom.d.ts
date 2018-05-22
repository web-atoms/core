import * as types from "./core/types";
export declare class Atom {
    static encodeParameters(p: types.NameValuePair): string;
    static url(url: string, query?: types.NameValuePair, hash?: types.NameValuePair): string;
}
