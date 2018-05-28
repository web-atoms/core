import { IDisposable } from "./types";
export declare class PropertyBinding implements IDisposable {
    constructor(name: string, path: string[] | (() => void), twoWays: boolean);
    dispose(): void;
}
