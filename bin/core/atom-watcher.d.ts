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
 * @implements {AtomDisposable}
 * @template T
 */
export declare class AtomWatcher<T> implements IDisposable {
    private forValidation;
    /**
     * If path was given as an array of string property path, you can use this `func` that will be executed
     * when any of property is updated.
     *
     * You must manually invoke evaluate after setting this property.
     *
     * @memberof AtomWatcher
     */
    func: (t: T) => any;
    private _isExecuting;
    funcText: string;
    private evaluatePath(target, path);
    /**
     *
     *
     * @param {boolean} [force]
     * @returns {*}
     * @memberof AtomWatcher
     */
    evaluate(force?: boolean): any;
    path: Array<ObjectProperty>[];
    target: any;
    /**
     * Creates an instance of AtomWatcher.
     *
     *      var w = new AtomWatcher(this, x => x.data.fullName = `${x.data.firstName} ${x.data.lastName}`);
     *
     * You must dispose `w` in order to avoid memory leaks.
     * Above method will set fullName whenver, data or its firstName,lastName property is modified.
     *
     * AtomWatcher will assign null if any expression results in null in single property path.
     *
     * In order to avoid null, you can rewrite above expression as,
     *
     *      var w = new AtomWatcher(this,
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
    runEvaluate: () => any;
    toString(): string;
    /**
     * This will dispose and unregister all watchers
     *
     * @memberof AtomWatcher
     */
    dispose(): void;
}
