import { AtomUI } from "./atom-ui";
import { INameValues } from "./types";
export declare class AtomUri {
    protocol: string;
    path: string;
    query: INameValues;
    hash: INameValues;
    scheme: string;
    host: string;
    port: string;
    atomUi: AtomUI;
    /**
     *
     */
    constructor(url: string);
}
