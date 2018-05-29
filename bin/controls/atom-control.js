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
        define(["require", "exports", "../core/atom-binder", "../core/bridge", "../core/property-binding", "../core/types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var atom_binder_1 = require("../core/atom-binder");
    var bridge_1 = require("../core/bridge");
    var property_binding_1 = require("../core/property-binding");
    var types_1 = require("../core/types");
    var AtomControl = /** @class */ (function () {
        function AtomControl(e) {
            this.mData = undefined;
            this.mViewModel = undefined;
            this.mLocalViewModel = undefined;
            this.eventHandlers = [];
            this.bindings = [];
            this.element = e;
            bridge_1.AtomBridge.instance.attachControl(e, this);
        }
        Object.defineProperty(AtomControl.prototype, "data", {
            get: function () {
                if (this.mData !== undefined) {
                    return this.mData;
                }
                var parent = this.parent;
                if (parent) {
                    return parent.data;
                }
                return undefined;
            },
            set: function (v) {
                this.mData = v;
                this.refreshInherited("data", function (a) { return a.mData === undefined; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomControl.prototype, "viewModel", {
            get: function () {
                if (this.mViewModel !== undefined) {
                    return this.mViewModel;
                }
                var parent = this.parent;
                if (parent) {
                    return parent.viewModel;
                }
                return undefined;
            },
            set: function (v) {
                this.mViewModel = v;
                this.refreshInherited("viewModel", function (a) { return a.mViewModel === undefined; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomControl.prototype, "localViewModel", {
            get: function () {
                if (this.mLocalViewModel !== undefined) {
                    return this.mLocalViewModel;
                }
                var parent = this.parent;
                if (parent) {
                    return parent.localViewModel;
                }
                return undefined;
            },
            set: function (v) {
                this.mLocalViewModel = v;
                this.refreshInherited("localViewModel", function (a) { return a.mLocalViewModel === undefined; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomControl.prototype, "parent", {
            get: function () {
                var ep = bridge_1.AtomBridge.instance.elementParent(this.element);
                if (!ep) {
                    return null;
                }
                return bridge_1.AtomBridge.instance.atomParent(ep);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomControl.prototype, "templateParent", {
            get: function () {
                return bridge_1.AtomBridge.instance.templateParent(this.element);
            },
            enumerable: true,
            configurable: true
        });
        AtomControl.prototype.bind = function (element, name, path, twoWays, valueFunc) {
            var _this = this;
            // remove exisiting binding if any
            var binding = this.bindings.find(function (x) { return x.name === name && (element ? x.element === element : true); });
            if (binding) {
                binding.dispose();
                types_1.ArrayHelper.remove(this.bindings, function (x) { return x === binding; });
            }
            binding = new property_binding_1.PropertyBinding(this, element, name, path, twoWays, valueFunc);
            this.bindings.push(binding);
            if (binding.twoWays) {
                binding.setupTwoWayBinding();
            }
            return new types_1.AtomDisposable(function () {
                binding.dispose();
                types_1.ArrayHelper.remove(_this.bindings, function (x) { return x === binding; });
            });
        };
        AtomControl.prototype.bindEvent = function (element, name, method, key) {
            if (!element) {
                return;
            }
            if (!method) {
                return;
            }
            var be = {
                element: element,
                name: name,
                handler: method
            };
            if (key) {
                be.key = key;
            }
            be.disposable = bridge_1.AtomBridge.instance.addEventHandler(element, name, method, false);
            this.eventHandlers.push(be);
        };
        AtomControl.prototype.unbindEvent = function (element, name, method, key) {
            var deleted = [];
            try {
                for (var _a = __values(this.eventHandlers), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var be = _b.value;
                    if (element && be.element !== element) {
                        return;
                    }
                    if (key && be.key !== key) {
                        return;
                    }
                    if (name && be.name !== name) {
                        return;
                    }
                    if (method && be.handler !== method) {
                        return;
                    }
                    be.disposable.dispose();
                    be.handler = null;
                    be.element = null;
                    be.name = null;
                    be.key = null;
                    deleted.push(be);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.eventHandlers = this.eventHandlers.filter(function (x) { return deleted.findIndex(function (d) { return d === x; }) !== -1; });
            var e_1, _c;
        };
        AtomControl.prototype.hasProperty = function (name) {
            return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), name);
        };
        AtomControl.prototype.setLocalValue = function (element, name, value) {
            if ((!element || element === this.element) && this.hasProperty(name)) {
                this[name] = value;
            }
            else {
                bridge_1.AtomBridge.instance.setValue(element, name, value);
            }
        };
        AtomControl.prototype.dispose = function (e) {
            bridge_1.AtomBridge.instance.visitDescendents(e || this.element, function (ec, ac) {
                if (ac) {
                    ac.dispose();
                    return false;
                }
                return true;
            });
            if (!e) {
                this.unbindEvent(null, null, null);
                try {
                    for (var _a = __values(this.bindings), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var binding = _b.value;
                        binding.dispose();
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                this.bindings.length = 0;
                this.bindings = null;
                bridge_1.AtomBridge.instance.dispose(this.element);
                this.element = null;
            }
            var e_2, _c;
        };
        AtomControl.prototype.append = function (element) {
            var ac = element instanceof AtomControl ? element : null;
            var e = ac ? ac.element : element;
            bridge_1.AtomBridge.instance.appendChild(this.element, e);
            if (ac) {
                ac.refreshInherited("viewModel", function (a) { return a.mViewModel === undefined; });
                ac.refreshInherited("localViewModel", function (a) { return a.mLocalViewModel === undefined; });
                ac.refreshInherited("data", function (a) { return a.mData === undefined; });
            }
            return this;
        };
        // tslint:disable-next-line:no-empty
        AtomControl.prototype.init = function () {
        };
        AtomControl.prototype.refreshInherited = function (name, fx) {
            atom_binder_1.AtomBinder.refreshValue(this, name);
            bridge_1.AtomBridge.instance.visitDescendents(this.element, function (e, ac) {
                if (ac) {
                    if (fx(ac)) {
                        ac.refreshInherited(name, fx);
                    }
                    return false;
                }
                return true;
            });
        };
        return AtomControl;
    }());
    exports.AtomControl = AtomControl;
});
//# sourceMappingURL=atom-control.js.map