var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AtomBinder = /** @class */ (function () {
        function AtomBinder() {
        }
        AtomBinder.getClone = function (dupeObj) {
            var retObj = {};
            if (typeof (dupeObj) === "object") {
                if (typeof (dupeObj.length) !== "undefined") {
                    retObj = new Array();
                }
                for (var objInd in dupeObj) {
                    if (dupeObj.hasOwnProperty()) {
                        var val = dupeObj[objInd];
                        if (val === undefined) {
                            continue;
                        }
                        if (val === null) {
                            retObj[objInd] = null;
                            continue;
                        }
                        if (/^\_\$\_/gi.test(objInd)) {
                            continue;
                        }
                        var type = typeof (val);
                        if (type === "object") {
                            if (val.constructor === Date) {
                                retObj[objInd] = "/DateISO(" + AtomDate.toLocalTime(val) + ")/";
                            }
                            else {
                                retObj[objInd] = AtomBinder.getClone(val);
                            }
                        }
                        else if (type === "string") {
                            retObj[objInd] = val;
                        }
                        else if (type === "number") {
                            retObj[objInd] = val;
                        }
                        else if (type === "boolean") {
                            ((val === true) ? retObj[objInd] = true : retObj[objInd] = false);
                        }
                        else if (type === date)
                            ') {;
                        retObj[objInd] = val.getTime();
                    }
                }
            }
        };
        return AtomBinder;
    }());
    exports.AtomBinder = AtomBinder;
    return retObj;
    setValue(target, key, value);
    any;
    {
        if (!target && value === undefined) {
            return;
        }
        var oldValue = AtomBinder.getValue(target, key);
        if (oldValue === value) {
            return;
        }
        var f = target["set_" + key];
        if (f) {
            f.apply(target, [value]);
        }
        else {
            target[key] = value;
        }
        AtomBinder.refreshValue(target, key);
    }
    getValue(target, key);
    any;
    {
        throw new Error("Method not implemented.");
    }
    refreshValue(target, key);
    {
        var handlers = AtomBinder.get_WatchHandler(target, key);
        if (handlers === undefined || handlers == null) {
            return;
        }
        try {
            for (var handlers_1 = __values(handlers), handlers_1_1 = handlers_1.next(); !handlers_1_1.done; handlers_1_1 = handlers_1.next()) {
                var item = handlers_1_1.value;
                item(target, key);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (handlers_1_1 && !handlers_1_1.done && (_a = handlers_1.return)) _a.call(handlers_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    add_WatchHandler(target, key, handler, WatchFunction);
    {
        if (target == null) {
            return;
        }
        var handlers = AtomBinder.get_WatchHandler(target, key);
        handlers.push(handler);
    }
    get_WatchHandler(target, IWatchableObject, key, string);
    WatchFunction[];
    {
        if (target == null) {
            return null;
        }
        var handlers = target._$_handlers;
        if (!handlers) {
            handlers = {};
            target._$_handlers = handlers;
        }
        var handlersForKey = handlers[key];
        if (handlersForKey === undefined || handlersForKey == null) {
            handlersForKey = [];
            handlers[key] = handlersForKey;
        }
        return handlersForKey;
    }
    remove_WatchHandler(target, IWatchableObject, key, string, handler, WatchFunction);
    {
        if (target == null) {
            return;
        }
        if (!target._$_handlers) {
            return;
        }
        var handlersForKey = target._$_handlers[key];
        if (handlersForKey === undefined || handlersForKey == null) {
            return;
        }
        handlersForKey = handlersForKey.filter(function (f) { return f !== handler; });
        if (handlersForKey.length) {
            target._$_handlers[key] = handlersForKey;
        }
        else {
            target._$_handlers[key] = null;
            delete target._$_handlers[key];
        }
    }
    invokeItemsEvent(target, any[], mode, string, index, number, item, any);
    {
        var key = "_items";
        var handlers = AtomBinder.get_WatchHandler(target, key);
        if (!handlers) {
            return;
        }
        try {
            for (var handlers_2 = __values(handlers), handlers_2_1 = handlers_2.next(); !handlers_2_1.done; handlers_2_1 = handlers_2.next()) {
                var obj = handlers_2_1.value;
                obj(target, mode, index, item);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (handlers_2_1 && !handlers_2_1.done && (_b = handlers_2.return)) _b.call(handlers_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        AtomBinder.refreshValue(target, "length");
    }
    refreshItems(ary);
    {
        AtomBinder.invokeItemsEvent(ary, "refresh", -1, null);
    }
    add_CollectionChanged(target, any[], handler, WatchFunction);
    {
        if (target == null) {
            return;
        }
        var handlers = AtomBinder.get_WatchHandler(target, "_items");
        handlers.push(handler);
    }
    remove_CollectionChanged(t, any[], handler, WatchFunction);
    {
        if (t == null) {
            return;
        }
        var target = t;
        if (!target._$_handlers) {
            return;
        }
        var key = "_items";
        var handlersForKey = target._$_handlers[key];
        if (handlersForKey === undefined || handlersForKey == null) {
            return;
        }
        handlersForKey = handlersForKey.filter(function (f) { return f === handler; });
        if (handlersForKey.length) {
            target._$_handlers[key] = handlersForKey;
        }
        else {
            target._$_handlers[key] = null;
            delete target._$_handlers[key];
        }
    }
    watch(item, any, property, string, f, function () { return void ; });
    IDisposable;
    {
        AtomBinder.add_WatchHandler(item, property, f);
        return new types_1.AtomDisposable(function () {
            AtomBinder.remove_WatchHandler(item, property, f);
        });
    }
    var e_1, _a, e_2, _b;
});
//# sourceMappingURL=atom-binder.js.map