define(["require", "exports", "./atom-binder"], function (require, exports, atom_binder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
                    var a = path_1[_i];
                    var item = a;
                    if (!Array.isArray(item)) {
                        this.path.push({ path: item, value: null });
                        continue;
                    }
                    for (var _a = 0, item_1 = item; _a < item_1.length; _a++) {
                        var b = item_1[_a];
                        var p = [];
                        b.push({ path: p, value: null });
                    }
                    this.pathList.push(p);
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
                for (var _b = 0, ae_1 = ae; _b < ae_1.length; _b++) {
                    var c = ae_1[_b];
                    this.path.push({ path: c, value: null });
                }
            }
            this.twoWays = twoWays;
            this.jq = jq;
            this.isUpdating = false;
        }
        AtomBinding.prototype.onPropChanged = function (sender, key) {
            // update target....
            // most like end of path...
            if (this.path == null || this.path.length === 0) {
                return;
            }
            var obj = this.control;
            var objKey = null;
            for (var _i = 0, _a = this.path; _i < _a.length; _i++) {
                var t = _a[_i];
                objKey = t;
                objKey.value = obj;
                if (!obj) {
                    return;
                }
                if (this.path.lastIndexOf(t) !== this.path.length) {
                    obj = atom_binder_1.AtomBinder.getValue(obj, objKey.path);
                }
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
                for (var _i = 0, _a = this.pathList; _i < _a.length; _i++) {
                    var ae = _a[_i];
                    newTarget.push(this.evaluate(target, ae));
                }
                for (var _b = 0, newTarget_1 = newTarget; _b < newTarget_1.length; _b++) {
                    var n = newTarget_1[_b];
                    if (n === undefined) {
                        return;
                    }
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
        };
        AtomBinding.prototype.evaluate = function (target, path) {
            var newTarget = null;
            var property = null;
            for (var _i = 0, path_2 = path; _i < path_2.length; _i++) {
                var v = path_2[_i];
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