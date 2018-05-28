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
    var PropertyBinding = /** @class */ (function () {
        function PropertyBinding(name, path, twoWays) {
        }
        PropertyBinding.prototype.dispose = function () {
            throw new Error("Method not implemented.");
        };
        return PropertyBinding;
    }());
    exports.PropertyBinding = PropertyBinding;
});
//# sourceMappingURL=property-binding.js.map