define(["require", "exports"], function (require, exports) {
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
//# sourceMappingURL=core-types.js.map