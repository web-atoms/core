import { parsePath } from "./ExpressionParser";

export interface IAtomComponent {
    element: any;
    viewModel: any;
    localViewModel: any;
    data: any;
    app: {
        callLater: (f: () => void) => void;
    };
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
    control.app.callLater(() => {
        control.setLocalValue(e, name, b.sourcePath(control));
    });
}

function event(name: string, b: Bind, control: IAtomComponent, e: any) {
    control.app.callLater(() => {
        if (isEvent.test(name)) {
            name = name.substr(5);
            name = (name[0].toLowerCase() + name.substr(1));
        }
        control.bindEvent(e, name, (e1) => {
            return (b.sourcePath as any)(control, e1);
        });
    });
}

function oneWay(name: string, b: Bind, control: IAtomComponent, e: any) {
    control.app.callLater(() => {
        // tslint:disable-next-line: ban-types
        control.bind(e, name, b.pathList , false, () => (b.sourcePath as Function).call(control, control) );
    });
}

function twoWays(name: string, b: Bind, control: IAtomComponent, e: any) {
    control.app.callLater(() => {
        control.bind(e, name, b.pathList, true, null);
    });
}

function presenter(name: string, b: Bind, control: IAtomComponent, e: any) {
    control[name] = e;
}

export default class Bind {

    public static get presenter(): any {
        return new Bind(presenter, undefined);
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
        return new Bind(twoWays, sourcePath);
    }

    public readonly sourcePath: bindingFunction;

    public readonly pathList: string[][];

    constructor(
        public readonly setupFunction: ((name: string, b: Bind, c: IAtomComponent, e: any) => void),
        sourcePath: bindingFunction
        ) {
        this.sourcePath = sourcePath;
        if (!this.sourcePath) {
            return;
        }
        if (Array.isArray(this.sourcePath)) {
            this.pathList = this.sourcePath as any;
            // this.setupFunction = null;
        } else {
            this.pathList = parsePath(this.sourcePath);
            // this.sourcePath = null;
        }

    }

}
