import { ObjectProperty } from "./atom-watcher";
import { IDisposable } from "./types";
export declare class PropertyBinding implements IDisposable {
    static onSetupTwoWayBinding: (binding: PropertyBinding) => IDisposable;
    path: ObjectProperty[][];
    target: any;
    twoWays: boolean;
    name: string;
    private watcher;
    private twoWaysDisposable;
    constructor(target: any, name: string, path: string[], twoWays: boolean);
    setupTwoWayBinding(): void;
    setInverseValue(value: any): void;
    dispose(): void;
}
