import { AtomBridge } from "./AtomBridge";
import { IAtomComponent } from "./AtomComponent";
import { AtomWatcher, ObjectProperty } from "./AtomWatcher";
import { AtomDisposable, IAtomElement, IDisposable, PathList } from "./types";

export class PropertyBinding<T extends IAtomElement> implements IDisposable {

    public element: T;
    public path: ObjectProperty[][];
    public target: IAtomComponent<T>;
    public twoWays: boolean;
    public name: string;

    private watcher: AtomWatcher<any>;
    private twoWaysDisposable: IDisposable;
    private isTwoWaySetup: boolean = false;
    private valueFunc: (...v: any[]) => any;

    constructor(
        target: IAtomComponent<T>,
        element: T,
        name: string,
        path: PathList[],
        twoWays: boolean,
        valueFunc: (...v: any[]) => any) {
        this.name = name;
        this.twoWays = twoWays;
        this.target = target;
        this.element = element;
        this.watcher = new AtomWatcher(target, path, true, false);
        this.valueFunc = valueFunc;
        this.watcher.func = (t: any, values: any[]) => {
            // don't send undefined value , ignore if any is undefined
            for (const iterator of values) {
                if (iterator === undefined) {
                    return;
                }
            }
            const cv = this.valueFunc ? this.valueFunc.apply(this, values) : values[0];
            this.target.setLocalValue(this.element, this.name, cv);
        };
        this.path = this.watcher.path;
        this.target.runAfterInit(() => {
            this.watcher.evaluate();
            if (twoWays) {
                this.setupTwoWayBinding();
            }
        });
    }

    public setupTwoWayBinding(): void {

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

        const watcher = new AtomWatcher(this.target, [[this.name]], false, false);
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
