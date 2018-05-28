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
        define(["require", "exports", "../core/atom-binder", "../core/atom-component", "../core/bridge"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var atom_binder_1 = require("../core/atom-binder");
    var atom_component_1 = require("../core/atom-component");
    var bridge_1 = require("../core/bridge");
    var AtomControl = /** @class */ (function (_super) {
        __extends(AtomControl, _super);
        function AtomControl(e) {
            var _this = _super.call(this) || this;
            _this.mData = undefined;
            _this.mViewModel = undefined;
            _this.mLocalViewModel = undefined;
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
            set: function (v) {
                this.mData = v;
                this.refreshInherited("data", function (a) { return a.mData === undefined; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomControl.prototype, "viewModel", {
            get: function () {
                if (this.mViewModel !== undefined) {
                    return this.mViewModel;
                }
                var parent = this.parent;
                if (parent) {
                    return parent.viewModel;
                }
                return undefined;
            },
            set: function (v) {
                this.mViewModel = v;
                this.refreshInherited("viewModel", function (a) { return a.mViewModel === undefined; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomControl.prototype, "localViewModel", {
            get: function () {
                if (this.mLocalViewModel !== undefined) {
                    return this.mLocalViewModel;
                }
                var parent = this.parent;
                if (parent) {
                    return parent.localViewModel;
                }
                return undefined;
            },
            set: function (v) {
                this.mLocalViewModel = v;
                this.refreshInherited("localViewModel", function (a) { return a.mLocalViewModel === undefined; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomControl.prototype, "parent", {
            get: function () {
                var ep = bridge_1.AtomBridge.instance.elementParent(this.element);
                if (!ep) {
                    return null;
                }
                return bridge_1.AtomBridge.instance.atomParent(ep);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomControl.prototype, "templateParent", {
            get: function () {
                return bridge_1.AtomBridge.instance.templateParent(this.element);
            },
            enumerable: true,
            configurable: true
        });
        AtomControl.prototype.dispose = function (e) {
            bridge_1.AtomBridge.instance.visitDescendents(e || this.element, function (ec, ac) {
                if (ac) {
                    ac.dispose();
                    return false;
                }
                return true;
            });
            _super.prototype.dispose.call(this, e);
            if (!e) {
                bridge_1.AtomBridge.instance.dispose(this.element);
            }
        };
        AtomControl.prototype.refreshInherited = function (name, fx) {
            atom_binder_1.AtomBinder.refreshValue(this, name);
            bridge_1.AtomBridge.instance.visitDescendents(this.element, function (e, ac) {
                if (ac) {
                    if (fx(ac)) {
                        ac.refreshInherited(name, fx);
                    }
                    return false;
                }
                return true;
            });
        };
        return AtomControl;
    }(atom_component_1.AtomComponent));
    exports.AtomControl = AtomControl;
});
//# sourceMappingURL=atom-control.js.map