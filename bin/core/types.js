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
    var AtomDisposable = /** @class */ (function () {
        /**
         *
         */
        // tslint:disable-next-line:ban-types
        function AtomDisposable(f) {
            this.f = f;
        }
        AtomDisposable.prototype.dispose = function () {
            this.f();
        };
        return AtomDisposable;
    }());
    exports.AtomDisposable = AtomDisposable;
    var ArrayHelper = /** @class */ (function () {
        function ArrayHelper() {
        }
        ArrayHelper.remove = function (a, filter) {
            for (var i = 0; i < a.length; i++) {
                var item = a[i];
                if (filter(item)) {
                    a.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        return ArrayHelper;
    }());
    exports.ArrayHelper = ArrayHelper;
});
//# sourceMappingURL=types.js.map