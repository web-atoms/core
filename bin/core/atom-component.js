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
        define(["require", "exports", "./bridge", "./property-binding", "./types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var bridge_1 = require("./bridge");
    var property_binding_1 = require("./property-binding");
    var types_1 = require("./types");
    var AtomComponent = /** @class */ (function () {
        function AtomComponent() {
            this.eventHandlers = [];
            this.bindings = [];
        }
        AtomComponent.prototype.bind = function (element, name, path, twoWays) {
            var _this = this;
            // remove exisiting binding if any
            var binding = this.bindings.find(function (x) { return x.name === name && (element ? x.element === element : true); });
            if (binding) {
                binding.dispose();
            }
            binding = new property_binding_1.PropertyBinding(this, element, name, path, twoWays);
            this.bindings.push(binding);
            if (binding.twoWays) {
                binding.setupTwoWayBinding();
            }
            return new types_1.AtomDisposable(function () {
                _this.bindings = _this.bindings.filter(function (x) { return x !== binding; });
            });
        };
        AtomComponent.prototype.bindEvent = function (element, name, method, key) {
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
        AtomComponent.prototype.unbindEvent = function (element, name, method, key) {
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
        AtomComponent.prototype.init = function () {
            // initialization used by derived controls
        };
        AtomComponent.prototype.dispose = function (e) {
            if (e) {
                return;
            }
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
            var e_2, _c;
        };
        return AtomComponent;
    }());
    exports.AtomComponent = AtomComponent;
});
//# sourceMappingURL=atom-component.js.map