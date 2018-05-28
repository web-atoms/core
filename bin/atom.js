(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./core/types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WebAtoms = require("./core/types");
    var Atom = /** @class */ (function () {
        function Atom() {
        }
        Atom.prototype.encodeParameters = function (p) {
            if (!p) {
                return "";
            }
            var s = "";
            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    var element = p[key];
                    s += "&" + key + "=" + encodeURIComponent(element);
                }
            }
            return s;
        };
        Atom.prototype.url = function (url, query, hash) {
            if (!url) {
                return url;
            }
            var p = this.encodeParameters(query);
            if (p) {
                if (url.indexOf("?") === -1) {
                    url += "?";
                }
                url += p;
            }
            p = this.encodeParameters(hash);
            if (p) {
                if (url.indexOf("#") === -1) {
                    url += "#";
                }
                url += p;
            }
            return url;
        };
        Atom.prototype.watch = function () {
            return new WebAtoms.AtomDisposable(function () {
                // console.log("Disposed");
                window.console.log("Disposed");
            });
        };
        return Atom;
    }());
    exports.Atom = Atom;
});
//# sourceMappingURL=atom.js.map