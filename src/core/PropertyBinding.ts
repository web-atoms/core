import { AtomBridge } from "./AtomBridge";
import { AtomComponent, IAtomComponent } from "./AtomComponent";
import { AtomOnce } from "./AtomOnce";
import { AtomWatcher, ObjectProperty } from "./AtomWatcher";
import { IValueConverter } from "./IValueConverter";
import { AtomDisposable, IAtomElement, IDisposable, PathList } from "./types";

export class PropertyBinding<T extends IAtomElement> implements IDisposable {

    public path: ObjectProperty[][];

    private watcher: AtomWatcher<any>;
    private twoWaysDisposable: IDisposable;
    private isTwoWaySetup: boolean = false;
    private updaterOnce: AtomOnce;

    private fromSourceToTarget: (...v: any[]) => any;
    private fromTargetToSource: (v: any) => any;
    private disposed: boolean;

    constructor(
        private target: IAtomComponent<T> | any,
        public readonly element: T,
        public readonly name: string,
        path: PathList[],
        private twoWays: boolean | string[],
        valueFunc: ((...v: any[]) => any) | IValueConverter,
        private source: any) {
        this.name = name;
        this.twoWays = twoWays;
        this.target = target;
        this.element = element;
        this.updaterOnce = new AtomOnce();
        if (valueFunc) {
            if (typeof valueFunc !== "function") {
                this.fromSourceToTarget = valueFunc.fromSource;
                this.fromTargetToSource = valueFunc.fromTarget;
            } else {
                this.fromSourceToTarget = valueFunc;
            }
        }
        this.watcher = new AtomWatcher(target, path, true, false,
            (...v: any[]) => {
                this.updaterOnce.run(() => {
                    if (this.disposed) {
                        return;
                    }
                    // set value
                    for (const iterator of v) {
                        if (iterator === undefined) {
                            return;
                        }
                    }
                    const cv = this.fromSourceToTarget ? this.fromSourceToTarget.apply(this, v) : v[0];
                    if (this.target instanceof AtomComponent) {
                        this.target.setLocalValue(this.element, this.name, cv);
                    } else {
                        this.target[name] = cv;
                    }
                });
            },
            source
        );
        this.path = this.watcher.path;
        if (this.target instanceof AtomComponent) {
            this.target.runAfterInit(() => {
                if (!this.watcher) {
                    // this is disposed ...
                    return;
                }
                this.watcher.evaluate();
                if (twoWays) {
                    this.setupTwoWayBinding();
                }
            });
        } else {
            this.watcher.evaluate();
            if (twoWays) {
                this.setupTwoWayBinding();
            }
        }
    }

    public setupTwoWayBinding(): void {

        if (this.target instanceof AtomComponent) {
            if (!(this.target.hasProperty(this.name) && !this.element || this.element === this.target.element )) {
                // most likely it has change event..
                let events: string[] = [];
                if (typeof this.twoWays !== "boolean") {
                    events = this.twoWays;
                }

                this.twoWaysDisposable = AtomBridge.instance.watchProperty(
                    this.element,
                    this.name,
                    events,
                    (v) => {
                        this.setInverseValue(v);
                    }
                );
                return;
            }
        }

        const watcher = new AtomWatcher(this.target, [[this.name]], false, false,
            (...values: any[]) => {
                if (this.isTwoWaySetup) {
                    this.setInverseValue(values[0]);
            }
        });
        watcher.evaluate();
        this.isTwoWaySetup = true;
        this.twoWaysDisposable = watcher;
    }

    public setInverseValue(value: any): void {

        if (!this.twoWays) {
            throw new Error("This Binding is not two ways.");
        }

        this.updaterOnce.run(() => {
            if (this.disposed) {
                return;
            }
            const first = this.path[0];
            const length = first.length;
            let v: any = this.target;
            let i = 0;
            let name: string;
            for (i = 0; i < length - 1; i ++) {
                name = first[i].name;
                if (name === "this") {
                    v = this.source || this.target;
                } else {
                    v = v[name];
                }
                if (!v) {
                    return;
                }
            }
            name = first[i].name;
            v[name] = this.fromTargetToSource ? this.fromTargetToSource.call(this, value) : value;
        });

    }

    public dispose(): void {
        if (this.twoWaysDisposable) {
            this.twoWaysDisposable.dispose();
            this.twoWaysDisposable = null;
        }
        this.watcher.dispose();
        this.disposed = true;
        this.watcher = null;
    }
}
