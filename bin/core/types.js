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
        function AtomDisposable(f) {
            this.f = f;
        }
        AtomDisposable.prototype.dispose = function () {
            this.f();
        };
        return AtomDisposable;
    }());
    exports.AtomDisposable = AtomDisposable;
});
//# sourceMappingURL=types.js.map