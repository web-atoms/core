define(["require", "exports", "./unit/base-test", "./core/atom-ui-tests"], function (require, exports, base_test_1, AtomUITests) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var instance = base_test_1.TestRunner.instance;
    // register unit test class
    instance.discover(AtomUITests);
    function test() {
        return instance.run();
    }
    exports.test = test;
});
// export Atom;
//# sourceMappingURL=test.js.map