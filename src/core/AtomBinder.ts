import { ArrayHelper, IDisposable  } from "./types";

export type WatchFunction = (target: any, key: string, index?: number, item?: any) => void;
export interface IWatchFunctionCollection {
    [key: string]: WatchFunction[];
}
export interface IWatchableObject {
    _$_handlers?: IWatchFunctionCollection;
    _$_bindable?: { [key: string]: 0 | 1 };
}

export class AtomBinder {

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

        if (Array.isArray(target)) {
            return;
        }

        // get existing property definition if it ha any
        const pv = AtomBinder.getPropertyDescriptor(target, key);

        // return if it has a getter
        // in case of getter/setter, it is responsibility of setter to refresh
        // object
        if (pv && pv.get) {
            return;
        }

        const tw = target as IWatchableObject;
        if (!tw._$_bindable) {
            tw._$_bindable = {};
        }
        if (!tw._$_bindable[key]) {
            tw._$_bindable[key] = 1;

            const o = target[key];

            const nk = `_$_${key}`;
            target[nk] = o;

            const set = function(v: any) {
                const ov = this[nk];
                // tslint:disable-next-line:triple-equals
                if (ov === undefined ? ov === v : ov == v) {
                    return;
                }
                this[nk] = v;
                AtomBinder.refreshValue(this, key);
            };

            const get = function() {
                return this[nk];
            };

            if (pv) {
                delete target[key];
                Object.defineProperty(target, key, {
                    get,
                    set,
                    configurable: true,
                    enumerable: true
                });
            } else {
                Object.defineProperty(target, key, {
                    get, set, enumerable: true, configurable: true
                });
            }
        }
    }

    public static getPropertyDescriptor(target, key: string): PropertyDescriptor {
        const pv = Object.getOwnPropertyDescriptor(target, key);
        if (!pv) {
            const pt = Object.getPrototypeOf(target);
            if (pt) {
                return AtomBinder.getPropertyDescriptor(pt, key);
            }
        }
        return pv;
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
            throw new Error("Target Array to watch cannot be null");
        }
        if (handler == null) {
            throw new Error("Target handle to watch an Array cannot be null");
        }
        const handlers = AtomBinder.get_WatchHandler(target as IWatchableObject, "_items");
        handlers.push(handler);
        return { dispose: () => {
                AtomBinder.remove_CollectionChanged(target, handler);
            }
        };
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
        return {
            dispose: () => {
                AtomBinder.remove_WatchHandler(item, property, f);
            }
        };
    }

    public static clear(a: any[]): any {
        a.length = 0;
        this.invokeItemsEvent(a, "refresh", -1, null);
        AtomBinder.refreshValue(a, "length");
    }

    public static addItem(a: any[], item: any): any {
        const index = a.length;
        a.push(item);
        this.invokeItemsEvent(a, "add", index, item);
        AtomBinder.refreshValue(a, "length");
    }

    public static removeItem(a: any[], item: any): boolean {
        const i = a.findIndex( (x) => x === item);
        if (i === -1) {
            return false;
        }
        a.splice(i, 1);
        AtomBinder.invokeItemsEvent(a, "remove", i, item);
        AtomBinder.refreshValue(a, "length");
        return true;
    }
}
