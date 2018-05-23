import { NameValues } from "./types";
export declare class AtomUri {
    protocol: string;
    path: string;
    query: NameValues;
    hash: NameValues;
    scheme: string;
    host: string;
    port: string;
    /**
     *
     */
    constructor(url: string);
}
