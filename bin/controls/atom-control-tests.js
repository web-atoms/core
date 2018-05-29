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
        define(["require", "exports", "../unit/base-test", "test-dom", "../core/bindable-properties", "./atom-control"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var base_test_1 = require("../unit/base-test");
    require("test-dom");
    var bindable_properties_1 = require("../core/bindable-properties");
    var atom_control_1 = require("./atom-control");
    var TestViewModel = /** @class */ (function () {
        function TestViewModel() {
        }
        __decorate([
            bindable_properties_1.bindableProperty
        ], TestViewModel.prototype, "name", void 0);
        return TestViewModel;
    }());
    var AtomControlTests = /** @class */ (function (_super) {
        __extends(AtomControlTests, _super);
        function AtomControlTests() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AtomControlTests.prototype.test1 = function () {
            var root = document.createElement("div");
            var control = new atom_control_1.AtomControl(root);
            var tv = new TestViewModel();
            tv.name = "a";
            control.viewModel = tv;
            control.bind(root, "data", ["viewModel.name"], true);
            base_test_1.Assert.equals("a", control.data);
            tv.name = "b";
            base_test_1.Assert.equals("b", control.data);
            control.data = "d";
            base_test_1.Assert.equals("d", tv.name);
            control.viewModel = new TestViewModel();
            tv.name = "c";
            base_test_1.Assert.equals(undefined, control.data);
        };
        __decorate([
            base_test_1.Test()
        ], AtomControlTests.prototype, "test1", null);
        AtomControlTests = __decorate([
            base_test_1.Category("Atom-Control")
        ], AtomControlTests);
        return AtomControlTests;
    }(base_test_1.TestItem));
    exports.AtomControlTests = AtomControlTests;
});
//# sourceMappingURL=atom-control-tests.js.map