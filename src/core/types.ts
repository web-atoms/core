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

/**
 *
 *
 * @export
 * @class CancelToken
 */
export class CancelToken {

    private listeners: Array<() => void> = [];

    private mCancelled: boolean;
    get cancelled(): boolean {
        return this.mCancelled;
    }

    public cancel(): void {
        this.mCancelled = true;
        const existing = this.listeners.slice(0);
        this.listeners.length = 0;
        for (const fx of existing) {
            fx();
        }
    }

    public reset(): void {
        this.mCancelled = false;
        this.listeners.length = 0;
    }

    public dispose() {
        this.listeners.length = 0;
    }

    public registerForCancel(f: () => void): void {
        if (this.mCancelled) {
            f();
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

export const DI = (window as any).UMD;
export const UMD = (window as any).UMD;
