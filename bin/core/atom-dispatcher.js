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
        // tslint:disable-next-line:ban-types
        AtomDispatcher.prototype.callLater = function (f) {
        };
        AtomDispatcher.prototype.pause = function () {
        };
        AtomDispatcher.prototype.start = function () {
        };
        AtomDispatcher.instance = new AtomDispatcher();
        return AtomDispatcher;
    }());
    exports.AtomDispatcher = AtomDispatcher;
});
//# sourceMappingURL=atom-dispatcher.js.map