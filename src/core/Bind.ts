import { parsePath, parsePathLists } from "./ExpressionParser";

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

export type bindingFunction<T extends IAtomComponent = IAtomComponent> = (control: T) => any;

function oneTime(name: string, b: Bind, control: IAtomComponent, e: any) {
    control.runAfterInit(() => {
        control.setLocalValue(e, name, b.sourcePath(control));
    });
}

function event(name: string, b: Bind, control: IAtomComponent, e: any) {
    control.runAfterInit(() => {
        if (isEvent.test(name)) {
            name = name.substr(5);
            name = (name[0].toLowerCase() + name.substr(1));
        }
        control.bindEvent(e, name, (e1) => {
            return (b.sourcePath as any)(control, e1);
        });
    });
}

function oneWay(name: string, b: Bind, control: IAtomComponent, e: any, creator: any) {
    if (b.pathList) {
        control.bind(e, name, b.pathList , false, () => {
            // tslint:disable-next-line: ban-types
            return (b.sourcePath as Function).call(creator, control);
        });
    }
    if (b.thisPathList) {
        control.bind(e, name, b.thisPathList , false, () => {
            // tslint:disable-next-line: ban-types
            return (b.sourcePath as Function).call(creator, control);
        }, creator);
    }
}

function twoWays(name: string, b: Bind, control: IAtomComponent, e: any, creator: any) {
    control.bind(e,
        name,
        b.thisPathList || b.pathList, (b.eventList as any) || true, null, b.thisPathList ? creator : undefined);
}

function presenter(name: string, b: Bind, control: IAtomComponent, e: any) {
    const n = b.name || name;
    let c = control.element as any;
    while (c && c.atomControl && c.atomControl[n] === undefined) {
        c = c._logicalParent || c.parentElement;
    }
    ((c && c.atomControl) || control)[n] = e;
}

export default class Bind {

    public static presenter(name?: string): Bind {
        return new Bind(presenter, null, name as any);
    }

    // tslint:disable-next-line: ban-types
    public static event<T extends IAtomComponent = IAtomComponent>(
        sourcePath: (control: T, e?: CustomEvent) => void): any {
        return new Bind(event, sourcePath as any);
    }

    public static oneTime<T extends IAtomComponent = IAtomComponent>(sourcePath: bindingFunction<T>): Bind {
        return new Bind(oneTime, sourcePath);
    }

    public static oneWay<T extends IAtomComponent = IAtomComponent>(sourcePath: bindingFunction<T>): Bind {
        return new Bind(oneWay, sourcePath);
    }

    public static twoWays<T extends IAtomComponent = IAtomComponent>(
        sourcePath: bindingFunction<T>,
        events?: string[]): Bind {
        return new Bind(twoWays, sourcePath, null, events);
    }

    public readonly sourcePath: bindingFunction;

    public readonly pathList: string[][];

    public readonly thisPathList: string[][];

    constructor(
        public readonly setupFunction: ((name: string, b: Bind, c: IAtomComponent, e: any, self?: any) => void),
        sourcePath: bindingFunction,
        public readonly name?: string,
        public readonly eventList?: string[]
        ) {
        this.sourcePath = sourcePath;
        if (!this.sourcePath) {
            return;
        }
        if (Array.isArray(this.sourcePath)) {
            this.pathList = this.sourcePath as any;
            // this.setupFunction = null;
        } else {
            const lists = parsePathLists(this.sourcePath);
            if (lists.pathList.length) {
                this.pathList = lists.pathList;
            }
            if (lists.thisPath.length) {
                this.thisPathList = lists.thisPath;
            }
        }

    }

}
