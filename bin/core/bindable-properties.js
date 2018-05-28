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
    function bindableProperty(target, key) {
        // property value
        var iVal = target[key];
        var keyName = "_" + key;
        target[keyName] = iVal;
        // property getter
        var getter = function () {
            // console.log(`Get: ${key} => ${_val}`);
            return this[keyName];
        };
        // property setter
        var setter = function (newVal) {
            // console.log(`Set: ${key} => ${newVal}`);
            // debugger;
            var oldValue = this[keyName];
            // tslint:disable-next-line:triple-equals
            if (oldValue == newVal) {
                return;
            }
            this[keyName] = newVal;
            atom_binder_1.AtomBinder.refreshValue(this, key);
            if (this.onPropertyChanged) {
                this.onPropertyChanged(key);
            }
        };
        // delete property
        if (delete target[key]) {
            // create new property with getter and setter
            Object.defineProperty(target, key, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
    }
    exports.bindableProperty = bindableProperty;
});
//# sourceMappingURL=bindable-properties.js.map