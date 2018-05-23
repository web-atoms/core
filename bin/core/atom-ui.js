var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AtomUI = /** @class */ (function () {
        function AtomUI() {
        }
        AtomUI.attr = function (arg0, arg1) {
            throw new Error("Method not implemented.");
        };
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
            try {
                for (var plist_1 = __values(plist), plist_1_1 = plist_1.next(); !plist_1_1.done; plist_1_1 = plist_1.next()) {
                    var item = plist_1_1.value;
                    var p = item.split("=");
                    var key = p[0];
                    var val = p[1];
                    if (val) {
                        val = decodeURIComponent(val);
                    }
                    // val = AtomUI.parseValue(val);
                    r[key] = AtomUI.parseValue(val);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (plist_1_1 && !plist_1_1.done && (_a = plist_1.return)) _a.call(plist_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return r;
            var e_1, _a;
        };
        AtomUI.childEnumerator = function (e) {
            var en;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        en = e.firstElementChild;
                        _a.label = 1;
                    case 1:
                        if (!en) return [3 /*break*/, 4];
                        if (!en) return [3 /*break*/, 3];
                        return [4 /*yield*/, en];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        en = en.nextElementSibling;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        };
        AtomUI.findPresenter = function (e) {
            try {
                for (var _a = __values(AtomUI.childEnumerator(e)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var item = _b.value;
                    var ap = AtomUI.attr(item, "atom-presenter");
                    if (ap) {
                        return item;
                    }
                    var c = AtomUI.findPresenter(item);
                    if (c) {
                        return c;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return null;
            var e_2, _c;
        };
        return AtomUI;
    }());
    exports.AtomUI = AtomUI;
});
//# sourceMappingURL=atom-ui.js.map