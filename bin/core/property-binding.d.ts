import { ObjectProperty } from "./atom-watcher";
import { IAtomElement, IDisposable } from "./types";
export declare class PropertyBinding implements IDisposable {
    static onSetupTwoWayBinding: (binding: PropertyBinding) => IDisposable;
    element: IAtomElement;
    path: ObjectProperty[][];
    target: any;
    twoWays: boolean;
    name: string;
    private watcher;
    private twoWaysDisposable;
    private isTwoWaySetup;
    constructor(target: any, element: IAtomElement, name: string, path: string[], twoWays: boolean);
    setupTwoWayBinding(): void;
    setInverseValue(value: any): void;
    dispose(): void;
}
