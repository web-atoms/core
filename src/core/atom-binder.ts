import { ArrayHelper, AtomDisposable, IDisposable  } from "./types";

export type WatchFunction = (target: any, key: string, index?: number, item?: any) => void;
export interface IWatchFunctionCollection {
    [key: string]: WatchFunction[];
}
export interface IWatchableObject {
    _$_handlers?: IWatchFunctionCollection;
}

export class AtomBinder {
    // public static getClone(dupeObj): any {
    //     let retObj = {};
    //     if (typeof (dupeObj) === "object") {
    //         if (typeof (dupeObj.length) !== "undefined") {
    //             retObj = new Array();
    //         }
    //         for (const objInd in dupeObj) {
    //             if (dupeObj.hasOwnProperty()) {
    //                 const val = dupeObj[objInd];
    //                 if (val === undefined) {
    //                     continue;
    //                 }
    //                 if (val === null) {
    //                     retObj[objInd] = null;
    //                     continue;
    //                 }
    //                 if (/^\_\$\_/gi.test(objInd)) {
    //                     continue;
    //                 }
    //                 const type = typeof (val);
    //                 if (type === "object") {
    //                     if (val.constructor === Date) {
    //                         // retObj[objInd] = "/DateISO(" + AtomDate.toLocalTime(val) + ")/";
    //                     } else {
    //                         retObj[objInd] = AtomBinder.getClone(val);
    //                     }
    //                 } else if (type === "string") {
    //                     retObj[objInd] = val;
    //                 } else if (type === "number") {
    //                     retObj[objInd] = val;
    //                 } else if (type === "boolean") {
    //                     ((val === true) ? retObj[objInd] = true : retObj[objInd] = false);
    //                 } else if (type === "date") {
    //                     retObj[objInd] = val.getTime();
    //                 }
    //             }
    //         }
    //     }
    //     return retObj;
    // }

    public static refreshValue(target, key) {
        const handlers = AtomBinder.get_WatchHandler(target, key);
        if (handlers === undefined || handlers == null) {
            return;
        }
        for (const item of handlers) {
            item(target, key);
        }

        if (target.onPropertyChanged) {
            target.onPropertyChanged(key);
        }
    }

    public static add_WatchHandler(target, key, handler: WatchFunction) {
        if (target == null) {
            return;
        }
        const handlers = AtomBinder.get_WatchHandler(target, key);
        handlers.push(handler);
    }

    public static get_WatchHandler(target: IWatchableObject, key: string): WatchFunction[] {
        if (target == null) {
            return null;
        }
        let handlers = target._$_handlers;
        if (!handlers) {
            handlers = {};
            target._$_handlers = handlers;
        }
        let handlersForKey = handlers[key];
        if (handlersForKey === undefined || handlersForKey == null) {
            handlersForKey = [];
            handlers[key] = handlersForKey;
        }
        return handlersForKey;
    }

    public static remove_WatchHandler(
        target: IWatchableObject,
        key: string,
        handler: WatchFunction) {
        if (target == null) {
            return;
        }
        if (!target._$_handlers) {
            return;
        }
        const handlersForKey = target._$_handlers[key];
        if (handlersForKey === undefined || handlersForKey == null) {
            return;
        }
        // handlersForKey = handlersForKey.filter( (f) => f !== handler);
        ArrayHelper.remove(handlersForKey, (f) => f === handler);
        if (!handlersForKey.length) {
            target._$_handlers[key] = null;
            delete target._$_handlers[key];
        }
    }

    public static invokeItemsEvent(target: any[], mode: string, index: number, item: any) {
        const key = "_items";
        const handlers = AtomBinder.get_WatchHandler(target as IWatchableObject, key);
        if (!handlers) {
            return;
        }
        for (const obj of handlers) {
            obj(target, mode, index, item);
        }
        AtomBinder.refreshValue(target, "length");
    }

    public static refreshItems(ary) {
        AtomBinder.invokeItemsEvent(ary, "refresh", -1, null);
    }

    public static add_CollectionChanged(target: any[], handler: WatchFunction): IDisposable {
        if (target == null) {
            return null;
        }
        const handlers = AtomBinder.get_WatchHandler(target as IWatchableObject, "_items");
        handlers.push(handler);
        return new AtomDisposable(() => {
            AtomBinder.remove_CollectionChanged(target, handler);
        });
    }

    public static remove_CollectionChanged(t: any[], handler: WatchFunction) {
        if (t == null) {
            return;
        }
        const target = t as IWatchableObject;
        if (!target._$_handlers) {
            return;
        }
        const key = "_items";
        const handlersForKey = target._$_handlers[key];
        if (handlersForKey === undefined || handlersForKey == null) {
            return;
        }
        ArrayHelper.remove(handlersForKey, (f) => f === handler);
        if (!handlersForKey.length) {
            target._$_handlers[key] = null;
            delete target._$_handlers[key];
        }
    }

    public static watch(item: any, property: string, f: WatchFunction): IDisposable {
        AtomBinder.add_WatchHandler(item, property, f);
        return new AtomDisposable( () => {
            AtomBinder.remove_WatchHandler(item, property, f);
        });
    }
}
