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
        define(["require", "exports", "./types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var types_1 = require("./types");
    var AtomBinder = /** @class */ (function () {
        function AtomBinder() {
        }
        AtomBinder.setValue = function (arg0, arg1, arg2) {
            throw new Error("Method not implemented.");
        };
        AtomBinder.getValue = function (arg0, arg1) {
            throw new Error("Method not implemented.");
        };
        AtomBinder.refreshValue = function (target, key) {
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
            var e_1, _a;
        };
        AtomBinder.add_WatchHandler = function (target, key, handler) {
            if (target == null) {
                return;
            }
            var handlers = AtomBinder.get_WatchHandler(target, key);
            handlers.push(handler);
        };
        AtomBinder.get_WatchHandler = function (target, key) {
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
        };
        AtomBinder.remove_WatchHandler = function (target, key, handler) {
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
        };
        AtomBinder.invokeItemsEvent = function (target, mode, index, item) {
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
                    if (handlers_2_1 && !handlers_2_1.done && (_a = handlers_2.return)) _a.call(handlers_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            AtomBinder.refreshValue(target, "length");
            var e_2, _a;
        };
        AtomBinder.refreshItems = function (ary) {
            AtomBinder.invokeItemsEvent(ary, "refresh", -1, null);
        };
        AtomBinder.add_CollectionChanged = function (target, handler) {
            if (target == null) {
                return;
            }
            var handlers = AtomBinder.get_WatchHandler(target, "_items");
            handlers.push(handler);
        };
        AtomBinder.remove_CollectionChanged = function (t, handler) {
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
        };
        AtomBinder.watch = function (item, property, f) {
            AtomBinder.add_WatchHandler(item, property, f);
            return new types_1.AtomDisposable(function () {
                AtomBinder.remove_WatchHandler(item, property, f);
            });
        };
        return AtomBinder;
    }());
    exports.AtomBinder = AtomBinder;
});
//# sourceMappingURL=atom-binder.js.map