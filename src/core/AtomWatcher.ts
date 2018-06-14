import { AtomBinder } from "./AtomBinder";
import { IDisposable, PathList } from "./types";

const viewModelParseWatchCache: {[key: string]: PathList[] } = {};

function parsePath(f: any): PathList[] {
    let str: string = f.toString().trim();

    const key: string = str;

    const px1: PathList[] = viewModelParseWatchCache[key];
    if (px1) {
        return px1;
    }

    if (str.endsWith("}")) {
        str = str.substr(0, str.length - 1);
    }

    if (str.startsWith("function (")) {
        str = str.substr("function (".length);
    }

    if (str.startsWith("function(")) {
        str = str.substr("function(".length);
    }

    str = str.trim();

    const index: number = str.indexOf(")");

    const isThis: boolean = index === 0;

    const p: string = isThis ? "\_this|this" : str.substr(0, index);

    str = str.substr(index + 1);

    const regExp: string = `(?:(${p})(?:(\\.[a-zA-Z_][a-zA-Z_0-9]*)+)(?:\\(?))`;

    const re: RegExp = new RegExp(regExp, "gi");

    let path: string[] = [];

    const ms: any = str.replace(re, (m) => {
        // console.log(`m: ${m}`);
        let px: string = m;
        if (px.startsWith("this.")) {
            px = px.substr(5);
        } else if (px.startsWith("_this.")) {
            px = px.substr(6);
        } else {
            px = px.substr(p.length + 1);
        }
        // console.log(px);
        if (!path.find((y) => y === px)) {
            path.push(px);
        }

        path = path.filter( (f1) => !f1.endsWith("(") );

        return m;
    });

    path = path.sort( (a, b) => b.localeCompare(a) );

    const rp: string[] = [];
    for (const rpitem of path) {
        if (rp.find( (x) => x.startsWith(rpitem) )) {
            continue;
        }
        rp.push(rpitem);
    }

    // console.log(`Watching: ${path.join(", ")}`);

    const pl = path.map( (p1) => p1.split("."));

    viewModelParseWatchCache[key] = pl;

    return pl;
}

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
    public func: (t: T, values: any[]) => any;

    public funcText: string;

    public path: ObjectProperty[][];

    public target: any;

    public runEvaluate: () => any;

    private forValidation: boolean;

    private isExecuting: boolean = false;

    /**
     * Creates an instance of AtomWatcher.
     *
     *      let w = new AtomWatcher(this, x => x.data.fullName = `${x.data.firstName} ${x.data.lastName}`);
     *
     * You must dispose `w` in order to avoid memory leaks.
     * Above method will set fullName whenver, data or its firstName,lastName property is modified.
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
     * @param {boolean} [forValidation] forValidtion - Ignore, used for internal purpose
     * @memberof AtomWatcher
     */
    constructor(
        target: T,
        path: PathList[] | (() => any) ,
        runAfterSetup: boolean,
        forValidation?: boolean,
        proxy?: () => any
    ) {
        this.target = target;
        let e: boolean = false;
        if (forValidation === true) {
            this.forValidation = true;
        }
        if (path instanceof Function) {
            const f: () => any = path;
            path = parsePath(path);
            e = true;
            this.func = proxy || f;
            this.funcText = f.toString();
        } else {
            this.func = proxy;
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
            console.warn("There is nothing to watch");
        }

        if (e) {
            if (runAfterSetup) {
                this.evaluate();
            }
            // else {
            //     // setup watcher...
            //     for(let p of this.path) {
            //         this.evaluatePath(this.target,p);
            //     }
            // }
        }

    }

    /**
     *
     *
     * @param {boolean} [force]
     * @returns {*}
     * @memberof AtomWatcher
     */
    public evaluate(force?: boolean): any {

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

            if (force === true) {
                this.forValidation = false;
            }

            if (this.forValidation) {
                const x: boolean = true;
                if (values.find( (x1) => x1 ? true : false)) {
                    this.forValidation = false;
                } else {
                    return;
                }
            }

            try {
                this.func.call(this.target, this.target, values);
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
        this.func = null;
        this.path.length = 0;
        this.path = null;
    }

    public evaluatePath(target: any, path: ObjectProperty[]): any {

        // console.log(`\tevaluatePath: ${path.map(op=>op.name).join(", ")}`);

        let newTarget: any = null;
        for (const p of path) {
            newTarget = target[p.name];
            if (!p.target) {
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

}
