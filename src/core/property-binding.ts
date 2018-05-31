import { AtomControl } from "../controls/atom-control";
import { AtomWatcher, ObjectProperty } from "./atom-watcher";
import { AtomBridge } from "./bridge";
import { AtomDisposable, IAtomElement, IDisposable } from "./types";

export class PropertyBinding implements IDisposable {

    public static onSetupTwoWayBinding: (binding: PropertyBinding) => IDisposable;

    public element: IAtomElement;
    public path: ObjectProperty[][];
    public target: AtomControl;
    public twoWays: boolean;
    public name: string;

    private watcher: AtomWatcher<any>;
    private twoWaysDisposable: IDisposable;
    private isTwoWaySetup: boolean = false;
    private valueFunc: (v: any[]) => any;

    constructor(
        target: AtomControl,
        element: IAtomElement,
        name: string,
        path: string[],
        twoWays: boolean,
        valueFunc: (v: any[]) => any) {
        this.name = name;
        this.twoWays = twoWays;
        this.target = target;
        this.element = element;
        this.watcher = new AtomWatcher(target, path, true, false);
        this.valueFunc = valueFunc;
        this.watcher.func = (t: any, values: any[]) => {
            const cv = this.valueFunc ? this.valueFunc(values) : values[0];
            this.target.setLocalValue(this.element, this.name, cv);
        };
        this.path = this.watcher.path;
        this.watcher.evaluate();
        if (twoWays) {
            this.setupTwoWayBinding();
        }
    }

    public setupTwoWayBinding(): void {
        if (PropertyBinding.onSetupTwoWayBinding) {
            this.twoWaysDisposable = PropertyBinding.onSetupTwoWayBinding(this);
            return;
        }

        if (!this.target.hasProperty(this.name)) {
            // most likely it has change event..
            this.twoWaysDisposable = AtomBridge.instance.watchProperty(
                this.element,
                this.name,
                (v) => {
                    this.setInverseValue(v);
                }
            );
            return;
        }

        const watcher = new AtomWatcher(this.target, [this.name], false, false);
        watcher.func = (t: any, values: any[]) => {
            if (this.isTwoWaySetup) {
                this.setInverseValue(values[0]);
            }
        };
        watcher.evaluate();
        this.isTwoWaySetup = true;
        this.twoWaysDisposable = new AtomDisposable(() => {
            watcher.dispose();
        });
    }

    public setInverseValue(value: any): void {

        if (!this.twoWays) {
            throw new Error("This Binding is not two ways.");
        }

        const first = this.path[0];
        const length = first.length;
        let v: any = this.target;
        let i = 0;
        for (i = 0; i < length - 1; i ++) {
            v = v[first[i].name];
            if (!v) {
                return;
            }
        }
        v[first[i].name] = value;
    }

    public dispose(): void {
        if (this.twoWaysDisposable) {
            this.twoWaysDisposable.dispose();
            this.twoWaysDisposable = null;
        }
        this.watcher.dispose();
    }
}
