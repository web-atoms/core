define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AtomUI = /** @class */ (function () {
        function AtomUI() {
        }
        AtomUI.atomParent = function (element) {
            var eany = element;
            if (eany.atomControl) {
                return eany.atomControl;
            }
            if (!element.parentNode) {
                return null;
            }
            return AtomUI.atomParent(eany._logicalParent || element.parentNode);
        };
        /**
         * Don't use
         * @static
         * @param {HTMLElement} e
         * @returns {HTMLElement}
         * @memberof AtomUI
         */
        AtomUI.cloneNode = function (e) {
            return e.cloneNode(true);
        };
        AtomUI.parseValue = function (val) {
            if (/^[0-9]+$/.test(val)) {
                var n;
                n = parseInt(val, 10);
                if (!isNaN(n)) {
                    return n;
                }
                return val;
            }
            if (/^[0-9]+\.[0-9]+/gi.test(val)) {
                n = parseFloat(val);
                if (!isNaN(n)) {
                    return n;
                }
                return val;
            }
            if (/true/.test(val)) {
                // val = true;
                // eturn val;
                return true;
            }
            if (/false/.test(val)) {
                // val = false;
                // return val;
                return false;
            }
            return val;
        };
        AtomUI.parseUrl = function (url) {
            var r = {};
            var plist = url.split("&");
            for (var _i = 0, plist_1 = plist; _i < plist_1.length; _i++) {
                var item = plist_1[_i];
                var p = item.split("=");
                var key = p[0];
                var val = p[1];
                if (val) {
                    val = decodeURIComponent(val);
                }
                // val = AtomUI.parseValue(val);
                r[key] = AtomUI.parseValue(val);
            }
            return r;
        };
        return AtomUI;
    }());
    exports.AtomUI = AtomUI;
});
//# sourceMappingURL=atom-ui.js.map