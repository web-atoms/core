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
        define(["require", "exports", "./atom-binder"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var atom_binder_1 = require("./atom-binder");
    var AtomBinding = /** @class */ (function () {
        /**
         *
         */
        // tslint:disable-next-line:max-line-length
        function AtomBinding(control, element, key, path, twoWays, jq, vf, events) {
            this.element = element;
            this.control = control;
            this.vf = vf;
            this.key = key;
            this.events = events;
            if (Array.isArray(path)) {
                this.pathList = [];
                this.path = [];
                try {
                    for (var path_1 = __values(path), path_1_1 = path_1.next(); !path_1_1.done; path_1_1 = path_1.next()) {
                        var a = path_1_1.value;
                        var item = a;
                        if (!Array.isArray(item)) {
                            this.path.push({ path: item, value: null });
                            continue;
                        }
                        try {
                            for (var item_1 = __values(item), item_1_1 = item_1.next(); !item_1_1.done; item_1_1 = item_1.next()) {
                                var b = item_1_1.value;
                                var p = [];
                                b.push({ path: p, value: null });
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (item_1_1 && !item_1_1.done && (_a = item_1.return)) _a.call(item_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        this.pathList.push(p);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (path_1_1 && !path_1_1.done && (_b = path_1.return)) _b.call(path_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (this.path.length) {
                    this.pathList = null;
                }
                else {
                    this.path = null;
                }
            }
            else {
                var ae = path.split(".");
                this.path = [];
                try {
                    for (var ae_1 = __values(ae), ae_1_1 = ae_1.next(); !ae_1_1.done; ae_1_1 = ae_1.next()) {
                        var c = ae_1_1.value;
                        this.path.push({ path: c, value: null });
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (ae_1_1 && !ae_1_1.done && (_c = ae_1.return)) _c.call(ae_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            this.twoWays = twoWays;
            this.jq = jq;
            this.isUpdating = false;
            var e_2, _b, e_1, _a, e_3, _c;
        }
        AtomBinding.prototype.onPropChanged = function (sender, key) {
            // update target....
            // most like end of path...
            if (this.path == null || this.path.length === 0) {
                return;
            }
            var obj = this.control;
            var objKey = null;
            try {
                for (var _a = __values(this.path), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var t = _b.value;
                    objKey = t;
                    objKey.value = obj;
                    if (!obj) {
                        return;
                    }
                    if (this.path.lastIndexOf(t) !== this.path.length) {
                        obj = atom_binder_1.AtomBinder.getValue(obj, objKey.path);
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_4) throw e_4.error; }
            }
            var value = null;
            // doubt
            // if (this.jq) {
            //     switch (this.key) {
            //         case "valueAsDate":
            //             value = this.element.valueAsDate;
            //             break;
            //         case "checked":
            //             value = this.element.checked ? true : false;
            //             break;
            //         default:
            //             value = $(this.element).val();
            //     }
            // } else {
            //     value = AtomBinder.getValue(this.control, this.key);
            // }
            atom_binder_1.AtomBinder.setValue(obj, objKey.path, value);
            var e_4, _c;
        };
        AtomBinding.prototype.onDataChanged = function (sender, key) {
            if (this.isUpdating) {
                return;
            }
            // called by jquery while posting an ajax request...
            if (arguments === undefined || arguments.length === 0) {
                return;
            }
            var target = this.control;
            if (this.pathList) {
                var newTarget = [];
                try {
                    for (var _a = __values(this.pathList), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var ae = _b.value;
                        newTarget.push(this.evaluate(target, ae));
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                try {
                    for (var newTarget_1 = __values(newTarget), newTarget_1_1 = newTarget_1.next(); !newTarget_1_1.done; newTarget_1_1 = newTarget_1.next()) {
                        var n = newTarget_1_1.value;
                        if (n === undefined) {
                            return;
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (newTarget_1_1 && !newTarget_1_1.done && (_d = newTarget_1.return)) _d.call(newTarget_1);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                this.setValue(newTarget);
            }
            else {
                var path = this.path;
                var nTarget = this.evaluate(target, path);
                if (nTarget !== undefined) {
                    this.setValue(newTarget);
                }
            }
            var e_5, _c, e_6, _d;
        };
        AtomBinding.prototype.evaluate = function (target, path) {
            var newTarget = null;
            var property = null;
            try {
                for (var path_2 = __values(path), path_2_1 = path_2.next(); !path_2_1.done; path_2_1 = path_2.next()) {
                    var v = path_2_1.value;
                    // first remove old handlers...
                    var remove = false;
                    while (target) {
                        property = v;
                        newTarget = atom_binder_1.AtomBinder.getValue(target, property.path);
                        if (!(/scope|appScope|atomParent|templateParent|localScope/gi.test(property.path))) {
                            // doubt
                            // var _this = this;
                            if (!property.value) {
                                this.bindEvent(target, "WatchHandler", "onDataChanged", property.path);
                            }
                            else if (property.value !== target) {
                                this.unbindEvent(property.value, "WatchHandler", null, property.path);
                                this.bindEvent(target, "WatchHandler", "onDataChanged", property.path);
                            }
                        }
                        property.value = target;
                        target = newTarget;
                    }
                    // doubt
                    // if (newTarget === undefined && AtomConfig.debug) {
                    //     log("Undefined:" + this.control._element.id + " -> " + ($.map(path, function (a) { return a.path; })).join("."));
                    // }
                    return newTarget;
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (path_2_1 && !path_2_1.done && (_a = path_2.return)) _a.call(path_2);
                }
                finally { if (e_7) throw e_7.error; }
            }
            var e_7, _a;
        };
        AtomBinding.onValChanged = function () {
            // doubt
            // var self= this;
            // webAtoms.dispatcher.callLater(function () { self.onPropChanged(null, null); });
        };
        AtomBinding.prototype.unbindEvent = function (arg0, arg1, arg2, arg3) {
            throw new Error("Method not implemented.");
        };
        AtomBinding.prototype.bindEvent = function (arg0, arg1, arg2, arg3) {
            throw new Error("Method not implemented.");
        };
        AtomBinding.prototype.setValue = function (arg0) {
            throw new Error("Method not implemented.");
        };
        return AtomBinding;
    }());
    exports.AtomBinding = AtomBinding;
});
//# sourceMappingURL=atom-binding.js.map