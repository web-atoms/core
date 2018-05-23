(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./unit/base-test", "./core/atom-ui-tests"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // declare function require(s:string):void;
    var base_test_1 = require("./unit/base-test");
    // import unit test modules here
    require("./core/atom-ui-tests");
    var instance = base_test_1.TestRunner.instance;
    instance.run().then(function () {
        console.log("Tests ran successfully.");
        process.exit();
    }).catch(function (e) {
        console.error(e);
        process.abort();
    });
});
//# sourceMappingURL=test.js.map