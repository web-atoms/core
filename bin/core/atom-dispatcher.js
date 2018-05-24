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
    var AtomDispatcher = /** @class */ (function () {
        function AtomDispatcher() {
        }
        AtomDispatcher.callLater = function (arg0) {
            throw new Error("Method not implemented.");
        };
        return AtomDispatcher;
    }());
    exports.AtomDispatcher = AtomDispatcher;
});
//# sourceMappingURL=atom-dispatcher.js.map