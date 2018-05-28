// import { Atom } from "../core/atom";
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
    var AtomBindingHelper = /** @class */ (function () {
        function AtomBindingHelper() {
        }
        return AtomBindingHelper;
    }());
    exports.AtomBindingHelper = AtomBindingHelper;
});
//# sourceMappingURL=atom-binding-helper.js.map