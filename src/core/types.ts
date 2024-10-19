import "reflect-metadata";
import Map from "./AtomMap";

// tslint:disable-next-line:no-empty-interface
export interface INativeComponent {
    appendChild(e: any);
    dispatchEvent(e: any);
    addEventListener(name: string, fx: any, capture?: boolean);
    removeEventListener(name: string, fx: any, capture?: boolean);
}

export interface INotifyPropertyChanging {

    onPropertyChanging(name: string, newValue: any, oldValue: any): void;

}

export interface INotifyPropertyChanged {

    onPropertyChanged(name: string): void;

}

export interface IClassOf<T> extends Function {
    // tslint:disable-next-line: callable-types
    new (... v: any[]): T;
}

export type IAnyInstanceType<T> = T extends { prototype: infer U } ? U : any;

export type IAtomElement = HTMLElement | INativeComponent;

export interface IUIElement {
    atomControl: IUIAtomControl;
}

export interface IUIAtomControl {
    element: IUIElement;
    invalidate();
    updateSize();
    dispose();
}

export type PathList = string[];

export interface INameValuePairs {
    [key: string]: any;
}

export interface INameValues {
    [key: string]: (string|number|boolean);
}

export interface IDisposable {
    dispose(): void ;
}

export interface IRect {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export type CancelReason = "cancelled" | "timeout";

export const ignoreValue: any = Symbol("ignore");

/**
 *
 *
 * @export
 * @class CancelToken
 */
export class CancelToken implements IDisposable {

    public static isCancelled(e: any) {
        if (/^(cancelled$|canceled$|aborterror\:)/i.test(e.message ?? e.toString().trim())) {
            return true;
        }
        if (e.name === "AbortError") {
            return true;
        }
    }

    private listeners: Array<(r: CancelReason) => void> = [];

    private mCancelled: (CancelReason | null | undefined) = null;
    public get cancelled(): (CancelReason | null | undefined) {
        return this.mCancelled;
    }

    private cancelTimeout = null;

    constructor(timeout: number = -1) {
        if (timeout > 0) {
            this.cancelTimeout = setTimeout(() => {
                this.cancelTimeout = null;
                this.cancel("timeout");
            }, timeout);
        }
    }

    public cancel(r: CancelReason = "cancelled"): void {
        this.mCancelled = r;
        const existing = this.listeners.slice(0);
        this.listeners.length = 0;
        for (const fx of existing) {
            fx(r);
        }
        this.dispose();
    }

    public reset(): void {
        this.mCancelled = null;
        this.dispose();
    }

    public dispose() {
        this.listeners.length = 0;
        if (this.cancelTimeout) {
            clearTimeout(this.cancelTimeout);
        }
    }

    public registerForCancel(f: (r: CancelReason) => void): void {
        if (this.mCancelled) {
            f(this.mCancelled);
            this.cancel();
            return;
        }
        this.listeners.push(f);
    }

}

export class ArrayHelper {
    public static remove<T>(a: T[], filter: (item: T) => boolean): boolean {
        for (let i = 0; i < a.length; i++) {
            const item = a[i];
            if (filter(item)) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    }

}

declare global {

    interface IKeyedArray<TKey, T> extends Array<T> {
        key?: TKey;
    }

    // tslint:disable-next-line
    interface Array<T> {
        flat(this: Array<T>, depth?: number): any[];
        groupBy?<TKey>(
            this: Array<T>, 
            keySelector: ((item: T) => TKey)): Array<IKeyedArray<TKey,T>>;
    }

    interface ObjectConstructor {
        values(t: any): any[];
    }
}

Object.values ??= function (t) {
    const r = [];
    for (const key in t) {
        if (Object.prototype.hasOwnProperty.call(t, key)) {
            const element = t[key];
            r.push(element);
        }
    }
    return r;
}

const flat = Array.prototype.flat ?? function (depth = 1) {
    const r = [];
    const flat = depth > 0;
    const nestDepth = depth - 1;
    const nestFlat = nestDepth > 0;
    for (const iterator of this) {
        if (flat && Array.isArray(iterator)) {
            if (nestFlat) {
                r.push(... iterator.flat(nestDepth));
                continue;
            }
            r.push(... iterator);
            continue;
        }
        r.push(iterator);
    }
    return r;
};

const groupBy = Array.prototype.groupBy ?? function (keySelector: any) {
    const map = new Map();
    const groups = [];
    for (const iterator of this) {
        const key = keySelector(iterator);
        let g = map.get(key);
        if (!g) {
            g = [] as IKeyedArray<any, any>;
            g.key = key;
            groups.push(g);
            map.set(key, g);
        }
        g.push(iterator);
    }
    map.clear();
    return groups;
};

Object.defineProperties(Array.prototype, {
    flat: {
        enumerable: false,
        value: flat,
        configurable: true
    },
    groupBy: {
        enumerable: false,
        value: groupBy,
        configurable: true
    }
})


export interface IUMDClass {
    debug: boolean;
    resolveViewClassAsync(path: string): Promise<any>;
    mockType(type: any, name: string): void;
    inject(type: any, name: string): void;
    resolveType(type: any): any;
    resolvePath(path: string): string;
    import<T>(path: string): Promise<T>;
}

declare var global: any;

const globalNS = (typeof window !== "undefined" ? window : (global as any)) as any;

export const DI = (globalNS).UMD as IUMDClass;
export const UMD = (globalNS).UMD as IUMDClass;
