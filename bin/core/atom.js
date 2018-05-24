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
    var Atom = /** @class */ (function () {
        function Atom() {
        }
        return Atom;
    }());
    exports.Atom = Atom;
});
//# sourceMappingURL=atom.js.map