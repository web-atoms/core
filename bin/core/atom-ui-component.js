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
        define(["require", "exports", "./atom-component"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var atom_component_1 = require("./atom-component");
    // all scope properties are removed, they are no longer needed
    var AtomUIComponent = /** @class */ (function (_super) {
        __extends(AtomUIComponent, _super);
        function AtomUIComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(AtomUIComponent.prototype, "owner", {
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        AtomUIComponent.prototype.getTemplate = function (name) {
            var t = this["_" + name];
            if (t) {
                return t;
            }
            // resolve..
            t = Templates.get(this.constructor, name);
            if (!t) {
                return null;
            }
            this["_" + name] = t;
            return t;
        };
        return AtomUIComponent;
    }(atom_component_1.AtomComponent));
    exports.AtomUIComponent = AtomUIComponent;
    var Templates = /** @class */ (function () {
        function Templates() {
        }
        Templates.get = function (arg0, arg1) {
            throw new Error("Method not implemented.");
        };
        return Templates;
    }());
    exports.Templates = Templates;
});
//# sourceMappingURL=atom-ui-component.js.map