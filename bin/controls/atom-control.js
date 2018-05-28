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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../core/atom-component", "../core/atom-ui", "../core/types"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var atom_component_1 = require("../core/atom-component");
    var atom_ui_1 = require("../core/atom-ui");
    var types_1 = require("../core/types");
    var AtomControl = /** @class */ (function (_super) {
        __extends(AtomControl, _super);
        function AtomControl(e) {
            var _this = _super.call(this) || this;
            _this.mData = undefined;
            _this.element = e;
            return _this;
        }
        Object.defineProperty(AtomControl.prototype, "data", {
            get: function () {
                if (this.mData !== undefined) {
                    return this.mData;
                }
                var parent = this.parent;
                if (parent) {
                    return parent.data;
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomControl.prototype, "parent", {
            get: function () {
                var e = this.element;
                if (e instanceof HTMLElement) {
                    return atom_ui_1.AtomUI.parent(e);
                }
                return types_1.AtomElementExtensions.parent(e);
            },
            enumerable: true,
            configurable: true
        });
        return AtomControl;
    }(atom_component_1.AtomComponent));
    exports.AtomControl = AtomControl;
});
//# sourceMappingURL=atom-control.js.map