var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Assert = /** @class */ (function () {
        function Assert() {
        }
        Assert.equals = function (expected, result, msg) {
            if (result !== expected) {
                Assert.throw(msg || "Expected " + expected + ", found " + result);
            }
        };
        Assert.doesNotEqual = function (expected, result, msg) {
            if (result === expected)
                Assert.throw(msg || "Not Expected " + expected + ", found " + result);
        };
        Assert.throws = function (expected, f, msg) {
            try {
                f();
                Assert.throw(msg || "Expected " + expected + ", no exception was thrown.");
            }
            catch (e) {
                if (e.message != expected) {
                    Assert.throw(msg || "Expected error " + expected + ", found " + e.message);
                }
            }
        };
        Assert.throwsAsync = function (expected, f, msg) {
            return __awaiter(this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, f()];
                        case 1:
                            _a.sent();
                            Assert.throw(msg || "Expected " + expected + ", no exception was thrown.");
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            if (e_1.message != expected) {
                                Assert.throw(msg || "Expected error " + expected + ", found " + e_1.message);
                            }
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        Assert.isTrue = function (b, msg) {
            if (b !== true)
                Assert.throw(msg || "Expected isTrue");
        };
        Assert.isFalse = function (b, msg) {
            if (b !== false)
                Assert.throw(msg || "Expected isFalse");
        };
        Assert.throw = function (message) {
            throw new Error("Assertion Failed, " + message);
        };
        return Assert;
    }());
    exports.Assert = Assert;
    function Category(name) {
        return function (target) {
            //target.testCategory = name;
            //return target;
            // save a reference to the original constructor
            var original = target;
            // a utility function to generate instances of a class
            function construct(constructor, args) {
                var c = function () {
                    return constructor.apply(this, args);
                };
                c.prototype = constructor.prototype;
                return new c();
            }
            // the new constructor behaviour
            var f = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this.testCategory = name;
                return construct(original, args);
            };
            // copy prototype so intanceof operator still works
            f.prototype = original.prototype;
            // return new constructor (will override original)
            return f;
        };
    }
    exports.Category = Category;
    var TestContext = /** @class */ (function () {
        function TestContext() {
            this.logs = [];
            this.errors = [];
        }
        TestContext.prototype.log = function (a) {
            this.logs.push(a);
        };
        TestContext.prototype.error = function (a) {
            this.errors.push(a);
        };
        TestContext.prototype.reset = function () {
            this.logs.length = 0;
            this.errors.length = 0;
        };
        return TestContext;
    }());
    exports.TestContext = TestContext;
    var TestMethod = /** @class */ (function () {
        function TestMethod(desc, name, category, target) {
            this.description = desc;
            this.name = name;
            this.category = category;
            this.testClass = target;
        }
        Object.defineProperty(TestMethod.prototype, "path", {
            get: function () {
                return this.category + "/" + this.name;
            },
            enumerable: true,
            configurable: true
        });
        return TestMethod;
    }());
    exports.TestMethod = TestMethod;
    var TestItem = /** @class */ (function () {
        function TestItem() {
            this.logText = "";
        }
        TestItem.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, 0];
                });
            });
        };
        TestItem.prototype.dispose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, 0];
                });
            });
        };
        TestItem.prototype.log = function (text) {
            if (text) {
                this.logText += text;
            }
        };
        TestItem.prototype.delay = function (n) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve();
                }, n);
            });
        };
        return TestItem;
    }());
    exports.TestItem = TestItem;
    function Test(name) {
        return function (target, propertyKey, descriptor) {
            // console.log(`Test called for ${target.constructor.name} in ${propertyKey}`)
            TestRunner.instance.tests.push(new TestMethod(name || propertyKey, propertyKey, target.constructor.name, target.constructor));
        };
    }
    exports.Test = Test;
    var TestRunner = /** @class */ (function () {
        function TestRunner() {
            this.tests = [];
            this.executed = [];
        }
        Object.defineProperty(TestRunner, "instance", {
            get: function () {
                if (!TestRunner._instance) {
                    TestRunner._instance = new TestRunner();
                }
                return TestRunner._instance;
            },
            enumerable: true,
            configurable: true
        });
        TestRunner.prototype.printAll = function () {
            try {
                // var results = this.executed.sort((a,b)=>{
                //     return a.testClass.category.localeCompare(b.testClass.category);
                // });
                // var results = results.sort((a,b)=>{
                //     return a.description.localeCompare(b.description);
                // });
                for (var _a = __values(this.executed), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var result = _b.value;
                    if (result.error) {
                        console.error(result.category + " > " + result.description + " failed " + result.error.message + ".");
                        console.error(result.error);
                    }
                    else {
                        console.log(result.category + " > " + result.description + " succeeded.");
                    }
                    if (result.logText) {
                        console.log("\t\t" + result.logText);
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
            var e_2, _c;
        };
        TestRunner.prototype.runTest = function (f, target) {
            return new Promise(function (resolve, reject) {
                try {
                    var t = f.apply(target);
                    if (t && t.then) {
                        t.then(function (v) {
                            resolve(v);
                        });
                        t.catch(function (e) {
                            reject(e);
                        });
                        return;
                    }
                    resolve();
                }
                catch (ex) {
                    reject(ex);
                }
            });
        };
        TestRunner.prototype.discover = function () {
            var a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                a[_i] = arguments[_i];
            }
        };
        TestRunner.prototype.run = function (filter) {
            return __awaiter(this, void 0, void 0, function () {
                var r, index, options, exp, categories;
                return __generator(this, function (_a) {
                    if (filter) {
                        r = null;
                        if (filter.startsWith("/")) {
                            index = filter.lastIndexOf("/");
                            options = filter.substr(index + 1);
                            filter = filter.substr(0, index);
                            exp = filter.substr(1);
                            r = new RegExp(exp, options);
                            this.tests = this.tests.filter(function (x) { return r.test(x.path); });
                        }
                        else {
                            categories = filter.split(",").map(function (x) { return x.trim().toLowerCase().split("."); });
                            this.tests = this.tests.filter(function (x) {
                                var lc = x.category.toLowerCase();
                                var ln = x.name.toLowerCase();
                                var b = categories.find(function (c) { return c[0] === lc && ((!c[1]) || (c[1] === ln)); });
                                return b;
                            });
                        }
                    }
                    return [2 /*return*/, this._run()];
                });
            });
        };
        TestRunner.prototype._run = function () {
            return __awaiter(this, void 0, void 0, function () {
                var peek, test, fx, e_3, er_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.tests.length === 0) {
                                this.printAll();
                                return [2 /*return*/];
                            }
                            peek = this.tests.shift();
                            this.executed.push(peek);
                            test = new peek.testClass;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, 5, 10]);
                            return [4 /*yield*/, test.init()];
                        case 2:
                            _a.sent();
                            fx = test[peek.name];
                            return [4 /*yield*/, this.runTest(fx, test)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 10];
                        case 4:
                            e_3 = _a.sent();
                            peek.error = e_3;
                            return [3 /*break*/, 10];
                        case 5:
                            peek.logText = test.logText;
                            _a.label = 6;
                        case 6:
                            _a.trys.push([6, 8, , 9]);
                            return [4 /*yield*/, test.dispose()];
                        case 7:
                            _a.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            er_1 = _a.sent();
                            peek.error = er_1;
                            return [3 /*break*/, 9];
                        case 9: return [7 /*endfinally*/];
                        case 10: return [4 /*yield*/, this._run()];
                        case 11:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return TestRunner;
    }());
    exports.TestRunner = TestRunner;
});
//# sourceMappingURL=base-test.js.map