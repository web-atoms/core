define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Atom = /** @class */ (function () {
        function Atom() {
        }
        Atom.encodeParameters = function (p) {
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
        Atom.url = function (url, query, hash) {
            if (!url) {
                return url;
            }
            var p = Atom.encodeParameters(query);
            if (p) {
                if (url.indexOf('?') === -1) {
                    url += '?';
                }
                url += p;
            }
            p = Atom.encodeParameters(hash);
            if (p) {
                if (url.indexOf("#") === -1) {
                    url += "#";
                }
                url += p;
            }
            return url;
        };
        return Atom;
    }());
    exports.Atom = Atom;
});
//# sourceMappingURL=atom.js.map