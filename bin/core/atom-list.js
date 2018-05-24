var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        define(["require", "exports", "./types", "./atom-binder"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var types_1 = require("./types");
    var atom_binder_1 = require("./atom-binder");
    /**
        *
        *
        * @export
        * @class AtomList
        * @extends {Array<T>}
        * @template T
        */
    var AtomList = /** @class */ (function (_super) {
        __extends(AtomList, _super);
        function AtomList() {
            var _this = _super.call(this) || this;
            _this._start = 0;
            _this._total = 0;
            _this._size = 10;
            // tslint:disable-next-line
            _this["__proto__"] = AtomList.prototype;
            _this.next = function () {
                _this.start = _this.start + _this.size;
            };
            _this.prev = function () {
                if (_this.start >= _this.size) {
                    _this.start = _this.start - _this.size;
                }
            };
            return _this;
        }
        Object.defineProperty(AtomList.prototype, "start", {
            get: function () {
                return this._start;
            },
            set: function (v) {
                if (v === this._start) {
                    return;
                }
                this._start = v;
                atom_binder_1.AtomBinder.refreshValue(this, "start");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomList.prototype, "total", {
            get: function () {
                return this._total;
            },
            set: function (v) {
                if (v === this._total) {
                    return;
                }
                this._total = v;
                atom_binder_1.AtomBinder.refreshValue(this, "total");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomList.prototype, "size", {
            get: function () {
                return this._size;
            },
            set: function (v) {
                if (v === this._size) {
                    return;
                }
                this._size = v;
                atom_binder_1.AtomBinder.refreshValue(this, "size");
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Adds the item in the list and refresh bindings
         * @param {T} item
         * @returns {number}
         * @memberof AtomList
         */
        AtomList.prototype.add = function (item) {
            var i = this.length;
            var n = this.push(item);
            atom_binder_1.AtomBinder.invokeItemsEvent(this, "add", i, item);
            atom_binder_1.AtomBinder.refreshValue(this, "length");
            return n;
        };
        /**
         * Add given items in the list and refresh bindings
         * @param {Array<T>} items
         * @memberof AtomList
         */
        AtomList.prototype.addAll = function (items) {
            try {
                for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                    var item = items_1_1.value;
                    var i = this.length;
                    this.push(item);
                    atom_binder_1.AtomBinder.invokeItemsEvent(this, "add", i, item);
                    atom_binder_1.AtomBinder.refreshValue(this, "length");
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // tslint:disable-next-line:no-string-literal
            var t = items["total"];
            if (t) {
                this.total = t;
            }
            var e_1, _a;
        };
        /**
         * Replaces list with given items, use this
         * to avoid flickering in screen
         * @param {T[]} items
         * @memberof AtomList
         */
        AtomList.prototype.replace = function (items, start, size) {
            this.length = items.length;
            for (var i = 0; i < items.length; i++) {
                this[i] = items[i];
            }
            this.refresh();
            // tslint:disable-next-line:no-string-literal
            var t = items["total"];
            if (t) {
                this.total = t;
            }
            if (start !== undefined) {
                this.start = start;
            }
            if (size !== undefined) {
                this.size = size;
            }
        };
        /**
         * Inserts given number in the list at position `i`
         * and refreshes the bindings.
         * @param {number} i
         * @param {T} item
         * @memberof AtomList
         */
        AtomList.prototype.insert = function (i, item) {
            var n = this.splice(i, 0, item);
            atom_binder_1.AtomBinder.invokeItemsEvent(this, "add", i, item);
            atom_binder_1.AtomBinder.refreshValue(this, "length");
        };
        /**
         * Removes item at given index i and refresh the bindings
         * @param {number} i
         * @memberof AtomList
         */
        AtomList.prototype.removeAt = function (i) {
            var item = this[i];
            this.splice(i, 1);
            atom_binder_1.AtomBinder.invokeItemsEvent(this, "remove", i, item);
            atom_binder_1.AtomBinder.refreshValue(this, "length");
        };
        /**
         * Removes given item or removes all items that match
         * given lambda as true and refresh the bindings
         * @param {(T | ((i:T) => boolean))} item
         * @returns {boolean} `true` if any item was removed
         * @memberof AtomList
         */
        AtomList.prototype.remove = function (item) {
            if (item instanceof Function) {
                var index = 0;
                var removed = false;
                try {
                    for (var _a = __values(this), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var it = _b.value;
                        if (item(it)) {
                            this.removeAt(index);
                            removed = true;
                        }
                        index++;
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return removed;
            }
            var n = this.indexOf(item);
            if (n !== -1) {
                this.removeAt(n);
                return true;
            }
            return false;
            var e_2, _c;
        };
        /**
         * Removes all items from the list and refreshes the bindings
         * @memberof AtomList
         */
        AtomList.prototype.clear = function () {
            this.length = 0;
            this.refresh();
        };
        AtomList.prototype.refresh = function () {
            atom_binder_1.AtomBinder.invokeItemsEvent(this, "refresh", -1, null);
            atom_binder_1.AtomBinder.refreshValue(this, "length");
        };
        AtomList.prototype.watch = function (f) {
            var _this = this;
            atom_binder_1.AtomBinder.add_CollectionChanged(this, f);
            return new types_1.AtomDisposable(function () {
                atom_binder_1.AtomBinder.remove_CollectionChanged(_this, f);
            });
        };
        return AtomList;
    }(Array));
    exports.AtomList = AtomList;
    // tslint:disable
    Array.prototype["add"] = AtomList.prototype.add;
    Array.prototype["addAll"] = AtomList.prototype.addAll;
    Array.prototype["clear"] = AtomList.prototype.clear;
    Array.prototype["refresh"] = AtomList.prototype.refresh;
    Array.prototype["remove"] = AtomList.prototype.remove;
    Array.prototype["removeAt"] = AtomList.prototype.removeAt;
    Array.prototype["watch"] = AtomList.prototype.watch;
});
//# sourceMappingURL=atom-list.js.map