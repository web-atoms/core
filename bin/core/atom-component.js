(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./atom-ui"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var atom_ui_1 = require("./atom-ui");
    var AtomComponent = /** @class */ (function () {
        function AtomComponent() {
            this.eventHandlers = [];
        }
        AtomComponent.prototype.bindEvent = function (element, name, 
            // tslint:disable-next-line:ban-types
            methodName, key, 
            // tslint:disable-next-line:ban-types
            method) {
            if (!element) {
                return;
            }
            if (!method) {
                if (methodName instanceof String) {
                    method = atom_ui_1.AtomUI.createDelegate(this, methodName);
                }
                else {
                    // tslint:disable-next-line:ban-types
                    method = methodName;
                }
            }
            var be = {
                element: element,
                name: name,
                methodName: methodName,
                handler: method
            };
            if (key) {
                be.key = key;
            }
            if (element.addEventListener) {
                element.addEventListener(name, method, false);
            }
            else {
                // var f: Function = element["add_" + name];
            }
        };
        AtomComponent.prototype.unbindEvent = function (arg0, arg1, arg2, arg3) {
            throw new Error("Method not implemented.");
        };
        AtomComponent.prototype.init = function () {
            // initialization used by derived controls
        };
        AtomComponent.prototype.dispose = function () {
            this.unbindEvent(null, null, null);
        };
        return AtomComponent;
    }());
    exports.AtomComponent = AtomComponent;
});
//# sourceMappingURL=atom-component.js.map