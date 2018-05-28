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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../unit/base-test", "./atom-ui"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var base_test_1 = require("../unit/base-test");
    var atom_ui_1 = require("./atom-ui");
    var TestUnit = /** @class */ (function (_super) {
        __extends(TestUnit, _super);
        function TestUnit() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TestUnit.prototype.run = function () {
            var a = atom_ui_1.AtomUI.parseUrl("a=b&c=1");
            base_test_1.Assert.equals("b", a.a);
            base_test_1.Assert.equals(1, a.c);
        };
        __decorate([
            base_test_1.Test()
        ], TestUnit.prototype, "run", null);
        TestUnit = __decorate([
            base_test_1.Category("atom-ui")
        ], TestUnit);
        return TestUnit;
    }(base_test_1.TestItem));
    exports.TestUnit = TestUnit;
});
//# sourceMappingURL=atom-ui-tests.js.map