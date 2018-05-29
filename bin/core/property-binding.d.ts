import { AtomControl } from "../controls/atom-control";
import { ObjectProperty } from "./atom-watcher";
import { IAtomElement, IDisposable } from "./types";
export declare class PropertyBinding implements IDisposable {
    static onSetupTwoWayBinding: (binding: PropertyBinding) => IDisposable;
    element: IAtomElement;
    path: ObjectProperty[][];
    target: AtomControl;
    twoWays: boolean;
    name: string;
    private watcher;
    private twoWaysDisposable;
    private isTwoWaySetup;
    private valueFunc;
    constructor(target: AtomControl, element: IAtomElement, name: string, path: string[], twoWays: boolean, valueFunc: (v: any[]) => any);
    setupTwoWayBinding(): void;
    setInverseValue(value: any): void;
    dispose(): void;
}
