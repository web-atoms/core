import { parsePath, parsePathLists } from "./ExpressionParser";
import { IValueConverter } from "./IValueConverter";

export interface IAtomComponent {
    element: any;
    viewModel: any;
    localViewModel: any;
    data: any;
    app: {
        callLater: (f: () => void) => void;
    };
    runAfterInit(f: () => void): void;
    setLocalValue(e: any, name: string, value: any): void;
    bindEvent(e: any, name: string, handler: any);
    bind(e: any, name: string, path: any, twoWays: boolean, converter: any, source?: any);
}

const isEvent = /^event/i;

/**
 * Bindings needs to be cloned...
 */

export type bindingFunction<T extends IAtomComponent = IAtomComponent> = (control: T, e?: any) => any;

export type bindingFunctionCommand<T extends IAtomComponent = IAtomComponent> = (control: T, e?: any) => (p) => void;

// function oneTime(name: string, b: Bind, control: IAtomComponent, e: any) {
//     control.runAfterInit(() => {
//         control.setLocalValue(e, name, b.sourcePath(control, e));
//     });
// }

// function event(name: string, b: Bind, control: IAtomComponent, e: any) {
//     control.runAfterInit(() => {
//         if (isEvent.test(name)) {
//             name = name.substr(5);
//             name = (name[0].toLowerCase() + name.substr(1));
//         }
//         control.bindEvent(e, name, (e1) => {
//             return (b.sourcePath as any)(control, e1);
//         });
//     });
// }

// function oneWay(name: string, b: Bind, control: IAtomComponent, e: any, creator: any) {
//     if (b.pathList) {
//         control.bind(e, name, b.pathList , false, () => {
//             // tslint:disable-next-line: ban-types
//             return (b.sourcePath as Function).call(creator, control, e);
//         });
//         return;
//     }
//     if (b.combined) {
//         const a = {

//             // it is `this`
//             t: creator,
//             // it is first parameter
//             x: control
//         };
//         control.bind(e, name, b.combined , false, () => {
//             // tslint:disable-next-line: ban-types
//             return (b.sourcePath as Function).call(creator, control, e);
//         }, a);
//         return;
//     }
//     if (b.thisPathList) {
//         control.bind(e, name, b.thisPathList , false, () => {
//             // tslint:disable-next-line: ban-types
//             return (b.sourcePath as Function).call(creator, control, e);
//         }, creator);
//         return;
//     }
// }

// function twoWays(name: string, b: Bind, control: IAtomComponent, e: any, creator: any) {
//     control.bind(e,
//         name,
//         b.thisPathList || b.pathList, (b.eventList as any) || true, null, b.thisPathList ? creator : undefined);
// }

function twoWaysConvert(name: string, b: Bind, control: IAtomComponent, e: any, creator: any) {
    control.bind(e,
        name,
        b.thisPathList || b.pathList, (b.eventList as any) || true, null, b.thisPathList ? creator : undefined);
}

// function presenter(name: string, b: Bind, control: IAtomComponent, e: any) {
//     const n = b.name || name;
//     let c = control.element as any;
//     while (c) {
//         if (c.atomControl && c.atomControl[n] !== undefined) {
//             break;
//         }
//         c = c._logicalParent || c.parentElement;
//     }
//     ((c && c.atomControl) || control)[n] = e;
// }

export interface IData<T> extends IAtomComponent {
    data: T;
}
export interface IVM<T> extends IAtomComponent {
    viewModel: T;
}

export interface ILVM<T> extends IAtomComponent {
    localViewModel: T;
}

export interface IBinder<T extends IAtomComponent> {
    presenter(name?: string): Bind;
    event(handler: (control: T, e?: CustomEvent) => void): any;
    oneTime(path: bindingFunction<T>): Bind;
    oneWay(path: bindingFunction<T>): Bind;
    twoWays(path: bindingFunction<T>, events?: string[]): Bind;
}

export const bindSymbol = Symbol("Bind");

export default class Bind {

    public static forControl<C extends IAtomComponent>(): IBinder<C> {
        return Bind as any;
    }

    public static forData<D>(): IBinder<IData<D>> {
        return Bind as any;
    }

    public static forViewModel<D>(): IBinder<IVM<D>> {
        return Bind as any;
    }

    public static forLocalViewModel<D>(): IBinder<ILVM<D>> {
        return Bind as any;
    }

    public static presenter(name?: string): any {
        return {
            [bindSymbol](cn: string, control: IAtomComponent, e: any, creator: any) {
                const n = name || cn;
                let c = control.element as any;
                while (c) {
                    if (c.atomControl && c.atomControl[n] !== undefined) {
                        break;
                    }
                    c = c._logicalParent || c.parentElement;
                }
                ((c && c.atomControl) || control)[n] = e;
            }
        };
    }

    // tslint:disable-next-line: ban-types
    public static event<T extends IAtomComponent = IAtomComponent>(
        sourcePath: (control: T, e?: CustomEvent) => void): any {
        return {
            [bindSymbol](name: string, control: IAtomComponent, e: any) {
                control.runAfterInit(() => {
                    if (isEvent.test(name)) {
                        name = name.substr(5);
                        name = (name[0].toLowerCase() + name.substr(1));
                    }
                    control.bindEvent(e, name, (e1) => {
                        return (sourcePath as any)(control, e1);
                    });
                });
            }
        };
    }

    public static oneTime<T extends IAtomComponent = IAtomComponent>(sourcePath: bindingFunction<T>): any {
        return {
            [bindSymbol](name: string, control: IAtomComponent, e: any) {
                control.runAfterInit(() => {
                    control.setLocalValue(e, name, sourcePath(control as any, e));
                });
            }
        };
    }

    public static command<T>(action: (p: T) => any) {
        return {
            [bindSymbol](name: string, control: IAtomComponent, e: any) {
                e[name] = (p) => {
                    const r = action(p);
                    if (r.then) {
                        r.catch((er) => {
                            console.error(er);
                        });
                    }
                };
            }
        };
    }

    public static oneWayCommand<T extends IAtomComponent = IAtomComponent>(sourcePath: bindingFunctionCommand<T>) {
        return this.oneWay(sourcePath);
    }

    public static oneWay<T extends IAtomComponent = IAtomComponent>(sourcePath: bindingFunction<T>): any {

        let pathList;
        let combined;
        let thisPathList;

        if (Array.isArray(sourcePath)) {
            pathList = sourcePath as any;
        } else {
            const lists = parsePathLists(sourcePath);
            if (lists.combined.length) {
                combined = lists.combined;
            }
            if (lists.pathList.length) {
                pathList = lists.pathList;
            }
            if (lists.thisPath.length) {
                thisPathList = lists.thisPath;
            }
        }

        if (!(combined || pathList || thisPathList)) {
            throw new Error(`Failed to setup binding for ${sourcePath}, parsing failed`);
        }

        return {
            [bindSymbol](name: string, control: IAtomComponent, e: any, creator: any) {
                if (pathList) {
                    control.bind(e, name, pathList, false, () => {
                        return sourcePath.call(creator, control, e);
                    });
                    return;
                }
                if (combined) {
                    const a = {
                        t: creator,
                        x: control
                    };
                    control.bind(e, name, combined, false, () => {
                        return sourcePath.call(creator, control, e);
                    }, a);
                }
                if (thisPathList) {
                    control.bind(e, name, thisPathList, false, () => {
                        return sourcePath.call(creator, control, e);
                    }, creator);
                }
            }
        };
    }

    public static twoWays<T extends IAtomComponent = IAtomComponent>(
        sourcePath: bindingFunction<T>,
        events?: string[],
        converter?: IValueConverter): any {

        let pathList;
        // let combined;
        let thisPathList;

        if (Array.isArray(sourcePath)) {
            pathList = sourcePath as any;
        } else {
            const lists = parsePathLists(sourcePath);
            if (lists.combined.length) {
                // combined = lists.combined;
                throw new Error("Cannot have combined binding for two ways");
            }
            if (lists.pathList.length) {
                pathList = lists.pathList;
            }
            if (lists.thisPath.length) {
                thisPathList = lists.thisPath;
            }
        }
        if (!(thisPathList  || pathList)) {
            throw new Error(`Failed to setup twoWay binding on ${sourcePath}`);
        }

        return {
            [bindSymbol](name: string, control: IAtomComponent, e: any, creator: any) {
                control.bind(e, name,
                    thisPathList || pathList,
                    (events as any) || true,
                    converter,
                    thisPathList ? creator : undefined);
            }
        };
    }

    // public static twoWaysConvert<T extends IAtomComponent = IAtomComponent>(
    //     sourcePath: bindingFunction<T>): Bind {
    //     const b = new Bind(twoWays, sourcePath, null, events);
    //     if (!(b.thisPathList  || b.pathList)) {
    //         throw new Error(`Failed to setup twoWay binding on ${sourcePath}`);
    //     }
    //     return b;
    // }

    /**
     * Use this for HTML only, this will fire two way binding
     * as soon as the input/textarea box is updated
     * @param sourcePath binding lambda expression
     */
    public static twoWaysImmediate<T extends IAtomComponent = IAtomComponent>(
        sourcePath: bindingFunction<T>): any {
        return this.twoWays(sourcePath, ["change", "input", "paste"]);
        // const b = new Bind(twoWays, sourcePath, null,
        //     ["change", "input", "paste"]);
        // if (!(b.thisPathList  || b.pathList)) {
        //     throw new Error(`Failed to setup twoWay binding on ${sourcePath}`);
        // }
        // return b;
    }

    public readonly sourcePath: bindingFunction;

    public readonly pathList: string[][];

    public readonly thisPathList: string[][];

    public readonly combined: string[][];

    constructor(
        public readonly setupFunction: ((name: string, b: Bind, c: IAtomComponent, e: any, self?: any) => void),
        sourcePath: bindingFunction,
        public readonly name?: string,
        public readonly eventList?: string[]
        ) {
        this.sourcePath = sourcePath;
        this[bindSymbol] = true;
        if (!this.sourcePath) {
            return;
        }
        if (Array.isArray(this.sourcePath)) {
            this.pathList = this.sourcePath as any;
            // this.setupFunction = null;
        } else {
            const lists = parsePathLists(this.sourcePath);
            if (lists.combined.length) {
                this.combined = lists.combined;
            }
            if (lists.pathList.length) {
                this.pathList = lists.pathList;
            }
            if (lists.thisPath.length) {
                this.thisPathList = lists.thisPath;
            }

            // if (setupFunction === oneWay) {
            //     if (!(this.combined || this.pathList || this.thisPathList)) {
            //         throw new Error(`Failed to setup binding for ${this.sourcePath}, parsing failed`);
            //     }
            // }
        }

    }

}
