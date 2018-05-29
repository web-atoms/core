var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./atom-ui", "./types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var atom_ui_1 = require("./atom-ui");
    var types_1 = require("./types");
    var BaseElementBridge = /** @class */ (function () {
        function BaseElementBridge() {
        }
        return BaseElementBridge;
    }());
    exports.BaseElementBridge = BaseElementBridge;
    var AtomElementBridge = /** @class */ (function (_super) {
        __extends(AtomElementBridge, _super);
        function AtomElementBridge() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AtomElementBridge.prototype.addEventHandler = function (element, name, handler, capture) {
            element.addEventListener(name, handler, capture);
            return new types_1.AtomDisposable(function () {
                element.removeEventListener(name, handler, capture);
            });
        };
        AtomElementBridge.prototype.atomParent = function (element, climbUp) {
            if (climbUp === void 0) { climbUp = true; }
            var eany = element;
            if (eany.atomControl) {
                return eany.atomControl;
            }
            if (!climbUp) {
                return null;
            }
            if (!element.parentNode) {
                return null;
            }
            return this.atomParent(this.elementParent(element));
        };
        AtomElementBridge.prototype.elementParent = function (element) {
            var eany = element;
            var lp = eany._logicalParent;
            if (lp) {
                return lp;
            }
            return element.parentElement;
        };
        AtomElementBridge.prototype.templateParent = function (element) {
            if (!element) {
                return null;
            }
            var eany = element;
            if (eany._templateParent) {
                return this.atomParent(element);
            }
            var parent = this.elementParent(element);
            if (!parent) {
                return null;
            }
            return this.templateParent(parent);
        };
        AtomElementBridge.prototype.visitDescendents = function (element, action) {
            try {
                for (var _a = __values(atom_ui_1.AtomUI.childEnumerator(element)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var iterator = _b.value;
                    var eany = iterator;
                    var ac = eany ? eany.atomControl : undefined;
                    if (!action(iterator, ac)) {
                        continue;
                    }
                    this.visitDescendents(iterator, action);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var e_1, _c;
        };
        AtomElementBridge.prototype.dispose = function (element) {
            var eany = element;
            eany.atomControl = undefined;
            delete eany.atomControl;
        };
        AtomElementBridge.prototype.appendChild = function (parent, child) {
            parent.appendChild(child);
        };
        AtomElementBridge.prototype.setValue = function (element, name, value) {
            element[name] = value;
        };
        AtomElementBridge.prototype.watchProperty = function (element, name, f) {
            var l = function (e) {
                f(element.value);
            };
            element.addEventListener("change", l, false);
            return new types_1.AtomDisposable(function () {
                element.removeEventListener("change", l, false);
            });
        };
        AtomElementBridge.prototype.attachControl = function (element, control) {
            element.atomControl = control;
        };
        return AtomElementBridge;
    }(BaseElementBridge));
    exports.AtomElementBridge = AtomElementBridge;
    var AtomBridge = /** @class */ (function () {
        function AtomBridge() {
        }
        AtomBridge.instance = new AtomElementBridge();
        return AtomBridge;
    }());
    exports.AtomBridge = AtomBridge;
});
//# sourceMappingURL=bridge.js.map