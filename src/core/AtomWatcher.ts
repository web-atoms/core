import { AtomBinder } from "./AtomBinder";
import { parsePath } from "./ExpressionParser";
import { IDisposable, PathList } from "./types";

export class ObjectProperty {

    public target: object;
    public name: string;
    public watcher: IDisposable;

    constructor(name: string) {
        this.name = name;
    }

    public toString(): string {
        return this.name;
    }

}

/**
 *
 *
 * @export
 * @class AtomWatcher
 * @implements {IDisposable}
 * @template T
 */
export class AtomWatcher<T> implements IDisposable {

    /**
     * If path was given as an array of string property path, you can use this `func` that will be executed
     * when any of property is updated.
     *
     * You must manually invoke evaluate after setting this property.
     *
     * @memberof AtomWatcher
     */
    public func: (...values: any[]) => any;

    public funcText: string;

    public path: ObjectProperty[][];

    public target: any;

    private runEvaluate: () => any;

    private forValidation: boolean;

    private isExecuting: boolean = false;

    /**
     * Creates an instance of AtomWatcher.
     *
     *      let w = new AtomWatcher(this, x => x.data.fullName = `${x.data.firstName} ${x.data.lastName}`);
     *
     * You must dispose `w` in order to avoid memory leaks.
     * Above method will set fullName whenever, data or its firstName,lastName property is modified.
     *
     * AtomWatcher will assign null if any expression results in null in single property path.
     *
     * In order to avoid null, you can rewrite above expression as,
     *
     *      let w = new AtomWatcher(this,
     *                  x => {
     *                      if(x.data.firstName && x.data.lastName){
     *                        x.data.fullName = `${x.data.firstName} ${x.data.lastName}`
     *                      }
     *                  });
     *
     * @param {T} target - Target on which watch will be set to observe given set of properties
     * @param {(PathList[] | ((x:T) => any))} path - Path is either lambda expression or array of
     *                      property path to watch, if path was lambda, it will be executed when any of
     *                      members will modify
     * @param {Function} onChanged - This function will be executed when any member in path is updated
     * @memberof AtomWatcher
     */
    constructor(
        target: T,
        path: PathList[] | (() => any) ,
        onChanged: (...v: any[]) => any,
        private source?: any
    ) {
        this.target = target;
        this.forValidation = true;
        if (path instanceof Function) {
            const f: () => any = path;
            path = parsePath(path);
            this.func = onChanged || f;
            this.funcText = f.toString();
        } else {
            this.func = onChanged;
        }

        this.runEvaluate = () => {
            this.evaluate();
        };

        (this.runEvaluate as any).watcher = this;

        this.path = path.map( (x) => x.map( (y) => new ObjectProperty(y) ) );

        if (!this.path.length) {
            // tslint:disable-next-line:no-debugger
            debugger;
            // tslint:disable-next-line:no-console
            console.warn("There is nothing to watch, do not use one way binding without any binding expression");
        }

    }

    public toString(): string {
        return this.func.toString();
    }

    /**
     * This will dispose and unregister all watchers
     *
     * @memberof AtomWatcher
     */
    public dispose(): void {
        for (const p of this.path) {
            for (const op of p) {
                if (op.watcher) {
                    op.watcher.dispose();
                    op.watcher = null;
                    op.target = null;
                }
            }
        }
        // tslint:disable-next-line:no-string-literal
        // this["disposedPath"] = this.path;
        this.func = null;
        // this.path.length = 0;
        this.path = null;
        this.source = null;
    }

    /**
     * Initialize the path targets
     * @param evaluate if true, evaluate entire watch expression and run onChange method
     */
    public init(evaluate?: boolean): void {
        if (evaluate) {
            this.evaluate(true);
        } else {
            for (const iterator of this.path) {
                this.evaluatePath(this.target, iterator);
            }
        }
    }

    private evaluatePath(target: any, path: ObjectProperty[]): any {

        // console.log(`\tevaluatePath: ${path.map(op=>op.name).join(", ")}`);

        let newTarget: any = null;
        for (const p of path) {

            if (this.source && p.name === "this") {
                target = this.source;
                continue;
            }

            newTarget = target[p.name];
            if (!p.target) {
                if (p.watcher) {
                    p.watcher.dispose();
                }
                p.watcher = AtomBinder.watch(target, p.name, this.runEvaluate);
            } else if (p.target !== target) {
                if (p.watcher) {
                    p.watcher.dispose();
                }
                p.watcher = AtomBinder.watch(target, p.name, this.runEvaluate);
            }
            p.target = target;
            target = newTarget;
            if (newTarget === undefined || newTarget === null) {
                break;
            }
        }
        return newTarget;
    }

    /**
     *
     *
     * @param {boolean} [force]
     * @returns {*}
     * @memberof AtomWatcher
     */
    private evaluate(force?: boolean): any {

        if (!this.path) {
            // this watcher may have been disposed...
            // tslint:disable-next-line:no-console
            console.warn(`Watcher is not disposed properly, please watch for any memory leak`);
            return;
        }

        if (this.isExecuting) {
            return;
        }

        const disposeWatchers: IDisposable[] = [];

        this.isExecuting = true;

        try {

            const values: any[] = [];

            const logs: string[][] = [];

            for (const p of this.path) {

                values.push(this.evaluatePath(this.target, p));
            }

            // if (force === true) {
            //     this.forValidation = false;
            // }

            // if (this.forValidation) {
            //     const x: boolean = true;
            //     if (values.find( (x1) => x1 ? true : false)) {
            //         this.forValidation = false;
            //     } else {
            //         return;
            //     }
            // }

            try {
                this.func.apply(this.target, values);
            } catch (e) {
                // tslint:disable-next-line:no-console
                console.warn(e);
            }
        } finally {
            this.isExecuting = false;

            for (const d of disposeWatchers) {
                d.dispose();
            }
        }
    }

}
