import "reflect-metadata";

// tslint:disable-next-line:no-empty-interface
export interface INativeComponent {

}

export interface INotifyPropertyChanging {

    onPropertyChanging(name: string, newValue: any, oldValue: any): void;

}

export interface INotifyPropertyChanged {

    onPropertyChanged(name: string): void;

}

export type IClassOf<T> = new (...v: any[]) => T;

export type IAtomElement = HTMLElement | INativeComponent;

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

/**
 *
 *
 * @export
 * @class CancelToken
 */
export class CancelToken implements IDisposable {

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

export const DI = (globalNS).UMD;
export const UMD = (globalNS).UMD;
