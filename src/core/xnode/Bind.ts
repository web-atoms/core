import { parsePath } from "../ExpressionParser";

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
        control.bindEvent(e, name, (e1) => (b.sourcePath as any)(control, e1));
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

export default class Bind {
    // tslint:disable-next-line: ban-types
    public static event<T extends IAtomComponent = IAtomComponent>(sourcePath: bindingFunction<T>): any {
        return new Bind(event, sourcePath as any);
    }

    public static oneTime<T extends IAtomComponent = IAtomComponent>(sourcePath: bindingFunction<T>): Bind {
        return new Bind(oneTime, sourcePath);
    }

    public static oneWay<T extends IAtomComponent = IAtomComponent>(sourcePath: bindingFunction<T>): Bind {
        return new Bind(oneWay, sourcePath);
    }

    public static twoWays<T extends IAtomComponent = IAtomComponent>(sourcePath: bindingFunction<T>): Bind {
        return new Bind(twoWays, sourcePath);
    }

    public readonly sourcePath: bindingFunction;

    public readonly pathList: string[][];

    constructor(
        public readonly setupFunction: ((name: string, b: Bind, c: IAtomComponent, e: any) => void),
        sourcePath: bindingFunction
        ) {
        this.sourcePath = sourcePath;

        if (Array.isArray(this.sourcePath)) {
            this.pathList = this.sourcePath as any;
            // this.setupFunction = null;
        } else {
            this.pathList = parsePath(this.sourcePath);
            // this.sourcePath = null;
        }

    }

}
