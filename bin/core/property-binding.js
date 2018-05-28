(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./atom-watcher", "./types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var atom_watcher_1 = require("./atom-watcher");
    var types_1 = require("./types");
    var PropertyBinding = /** @class */ (function () {
        function PropertyBinding(target, element, name, path, twoWays) {
            this.isTwoWaySetup = false;
            this.name = name;
            this.twoWays = twoWays;
            this.target = target;
            this.element = element;
            this.watcher = new atom_watcher_1.AtomWatcher(target, path, true, false);
            this.watcher.func = function (t, values) {
                target[name] = values[0];
            };
            this.path = this.watcher.path;
            this.watcher.evaluate();
            if (twoWays) {
                this.setupTwoWayBinding();
            }
        }
        PropertyBinding.prototype.setupTwoWayBinding = function () {
            var _this = this;
            if (PropertyBinding.onSetupTwoWayBinding) {
                this.twoWaysDisposable = PropertyBinding.onSetupTwoWayBinding(this);
                return;
            }
            var watcher = new atom_watcher_1.AtomWatcher(this.target, [this.name], false, false);
            watcher.func = function (t, values) {
                if (_this.isTwoWaySetup) {
                    _this.setInverseValue(values[0]);
                }
            };
            watcher.evaluate();
            this.isTwoWaySetup = true;
            this.twoWaysDisposable = new types_1.AtomDisposable(function () {
                watcher.dispose();
            });
        };
        PropertyBinding.prototype.setInverseValue = function (value) {
            if (!this.twoWays) {
                throw new Error("This Binding is not two ways.");
            }
            var first = this.path[0];
            var length = first.length;
            var v = this.target;
            var i = 0;
            for (i = 0; i < length - 1; i++) {
                v = v[first[i].name];
                if (!v) {
                    return;
                }
            }
            v[first[i].name] = value;
        };
        PropertyBinding.prototype.dispose = function () {
            if (this.twoWaysDisposable) {
                this.twoWaysDisposable.dispose();
                this.twoWaysDisposable = null;
            }
            this.watcher.dispose();
        };
        return PropertyBinding;
    }());
    exports.PropertyBinding = PropertyBinding;
});
//# sourceMappingURL=property-binding.js.map