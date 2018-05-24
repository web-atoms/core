import { IDisposable } from "./types";
export declare type WatchFunction = (target: any, key: string, index?: number, item?: any) => void;
export interface IWatchFunctionCollection {
    [key: string]: WatchFunction[];
}
export interface IWatchableObject {
    _$_handlers?: IWatchFunctionCollection;
}
export declare class AtomBinder {
    static setValue(arg0: any, arg1: any, arg2: any): any;
    static getValue(arg0: any, arg1: any): any;
    static refreshValue(target: any, key: any): void;
    static add_WatchHandler(target: any, key: any, handler: WatchFunction): void;
    static get_WatchHandler(target: IWatchableObject, key: string): WatchFunction[];
    static remove_WatchHandler(target: IWatchableObject, key: string, handler: WatchFunction): void;
    static invokeItemsEvent(target: any[], mode: string, index: number, item: any): void;
    static refreshItems(ary: any): void;
    static add_CollectionChanged(target: any[], handler: WatchFunction): void;
    static remove_CollectionChanged(t: any[], handler: WatchFunction): void;
    static watch(item: any, property: string, f: () => void): IDisposable;
}
