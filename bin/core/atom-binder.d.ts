export declare type WatchFunction = (target: any, key: string, index?: number, item?: any) => void;
export interface IWatchFunctionCollection {
    [key: string]: WatchFunction[];
}
export interface IWatchableObject {
    _$_handlers?: IWatchFunctionCollection;
}
export declare class AtomBinder {
    static getClone(dupeObj: any): any;
}
