import { IDisposable } from "./types";
export declare class ObjectProperty {
    target: object;
    name: string;
    watcher: IDisposable;
    constructor(name: string);
    toString(): string;
}
/**
 *
 *
 * @export
 * @class AtomWatcher
 * @implements {IDisposable}
 * @template T
 */
export declare class AtomWatcher<T> implements IDisposable {
    /**
     * If path was given as an array of string property path, you can use this `func` that will be executed
     * when any of property is updated.
     *
     * You must manually invoke evaluate after setting this property.
     *
     * @memberof AtomWatcher
     */
    func: (t: T, values: any[]) => any;
    funcText: string;
    path: ObjectProperty[][];
    target: any;
    runEvaluate: () => any;
    private forValidation;
    private isExecuting;
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
     * @param {(string[] | ((x:T) => any))} path - Path is either lambda expression or array of
     *                      property path to watch, if path was lambda, it will be executed when any of
     *                      members will modify
     * @param {boolean} [forValidation] forValidtion - Ignore, used for internal purpose
     * @memberof AtomWatcher
     */
    constructor(target: T, path: string[] | (() => any), runAfterSetup: boolean, forValidation?: boolean);
    /**
     *
     *
     * @param {boolean} [force]
     * @returns {*}
     * @memberof AtomWatcher
     */
    evaluate(force?: boolean): any;
    toString(): string;
    /**
     * This will dispose and unregister all watchers
     *
     * @memberof AtomWatcher
     */
    dispose(): void;
    private evaluatePath(target, path);
}
