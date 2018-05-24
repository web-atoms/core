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
        define(["require", "exports", "./atom-binder"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var atom_binder_1 = require("./atom-binder");
    var _viewModelParseWatchCache = {};
    function parsePath(f) {
        var str = f.toString().trim();
        var key = str;
        var px = _viewModelParseWatchCache[key];
        if (px) {
            return px;
        }
        if (str.endsWith("}")) {
            str = str.substr(0, str.length - 1);
        }
        if (str.startsWith("function (")) {
            str = str.substr("function (".length);
        }
        if (str.startsWith("function(")) {
            str = str.substr("function(".length);
        }
        str = str.trim();
        var index = str.indexOf(")");
        var isThis = index === 0;
        var p = isThis ? "\_this|this" : str.substr(0, index);
        str = str.substr(index + 1);
        var regExp = "(?:(" + p + ")(?:(\\.[a-zA-Z_][a-zA-Z_0-9]*)+)(?:\\(?))";
        var re = new RegExp(regExp, "gi");
        var path = [];
        var ms = str.replace(re, function (m) {
            // console.log(`m: ${m}`);
            var px = m;
            if (px.startsWith("this.")) {
                px = px.substr(5);
            }
            else if (px.startsWith("_this.")) {
                px = px.substr(6);
            }
            else {
                px = px.substr(p.length + 1);
            }
            // console.log(px);
            if (!path.find(function (y) { return y === px; })) {
                path.push(px);
            }
            path = path.filter(function (f) { return !f.endsWith("("); });
            return m;
        });
        // debugger;
        path = path.sort(function (a, b) { return b.localeCompare(a); });
        var rp = [];
        try {
            for (var path_1 = __values(path), path_1_1 = path_1.next(); !path_1_1.done; path_1_1 = path_1.next()) {
                var rpitem = path_1_1.value;
                if (rp.find(function (x) { return x.startsWith(rpitem); })) {
                    continue;
                }
                rp.push(rpitem);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (path_1_1 && !path_1_1.done && (_a = path_1.return)) _a.call(path_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // console.log(`Watching: ${path.join(", ")}`);
        _viewModelParseWatchCache[key] = path;
        return path;
        var e_1, _a;
    }
    var ObjectProperty = /** @class */ (function () {
        function ObjectProperty(name) {
            this.name = name;
        }
        ObjectProperty.prototype.toString = function () {
            return this.name;
        };
        return ObjectProperty;
    }());
    exports.ObjectProperty = ObjectProperty;
    /**
     *
     *
     * @export
     * @class AtomWatcher
     * @implements {AtomDisposable}
     * @template T
     */
    var AtomWatcher = /** @class */ (function () {
        /**
         * Creates an instance of AtomWatcher.
         *
         *      var w = new AtomWatcher(this, x => x.data.fullName = `${x.data.firstName} ${x.data.lastName}`);
         *
         * You must dispose `w` in order to avoid memory leaks.
         * Above method will set fullName whenver, data or its firstName,lastName property is modified.
         *
         * AtomWatcher will assign null if any expression results in null in single property path.
         *
         * In order to avoid null, you can rewrite above expression as,
         *
         *      var w = new AtomWatcher(this,
         *                  x => {
         *                      if(x.data.firstName && x.data.lastName){
         *                        x.data.fullName = `${x.data.firstName} ${x.data.lastName}`
         *                      }
         *                  });
         *
         * @param {T} target - Target on which watch will be set to observe given set of properties
         * @param {(string[] | ((x:T) => any))} path - Path is either lambda expression or array of
         *                      property path to watch, if path was lambda, it will be executed when any of
         *                      members will modify
         * @param {boolean} [forValidation] forValidtion - Ignore, used for internal purpose
         * @memberof AtomWatcher
         */
        function AtomWatcher(target, path, runAfterSetup, forValidation) {
            var _this = this;
            this._isExecuting = false;
            this.target = target;
            var e = false;
            if (forValidation === true) {
                this.forValidation = true;
            }
            if (path instanceof Function) {
                var f = path;
                path = parsePath(path);
                e = true;
                this.func = f;
                this.funcText = f.toString();
            }
            this.runEvaluate = function () {
                _this.evaluate();
            };
            this.runEvaluate.watcher = this;
            this.path = path.map(function (x) { return x.split(".").map(function (y) { return new ObjectProperty(y); }); });
            if (e) {
                if (runAfterSetup) {
                    this.evaluate();
                }
                // else {
                //     // setup watcher...
                //     for(var p of this.path) {
                //         this.evaluatePath(this.target,p);
                //     }
                // }
            }
        }
        AtomWatcher.prototype.evaluatePath = function (target, path) {
            // console.log(`\tevaluatePath: ${path.map(op=>op.name).join(", ")}`);
            var newTarget = null;
            try {
                for (var path_2 = __values(path), path_2_1 = path_2.next(); !path_2_1.done; path_2_1 = path_2.next()) {
                    var p = path_2_1.value;
                    newTarget = atom_binder_1.AtomBinder.getValue(target, p.name);
                    if (!p.target) {
                        p.watcher = atom_binder_1.AtomBinder.watch(target, p.name, this.runEvaluate);
                    }
                    else if (p.target !== target) {
                        if (p.watcher) {
                            p.watcher.dispose();
                        }
                        p.watcher = atom_binder_1.AtomBinder.watch(target, p.name, this.runEvaluate);
                    }
                    p.target = target;
                    target = newTarget;
                    if (newTarget === undefined || newTarget === null) {
                        break;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (path_2_1 && !path_2_1.done && (_a = path_2.return)) _a.call(path_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return newTarget;
            var e_2, _a;
        };
        /**
         *
         *
         * @param {boolean} [force]
         * @returns {*}
         * @memberof AtomWatcher
         */
        AtomWatcher.prototype.evaluate = function (force) {
            if (this._isExecuting) {
                return;
            }
            var disposeWatchers = [];
            this._isExecuting = true;
            try {
                var values = [];
                var logs = [];
                try {
                    for (var _a = __values(this.path), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var p = _b.value;
                        values.push(this.evaluatePath(this.target, p));
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                if (force === true) {
                    this.forValidation = false;
                }
                if (this.forValidation) {
                    var x = true;
                    if (values.find(function (x) { return x ? true : false; })) {
                        this.forValidation = false;
                    }
                    else {
                        return;
                    }
                }
                try {
                    this.func.call(this.target, this.target);
                }
                catch (e) {
                    console.warn(e);
                }
            }
            finally {
                this._isExecuting = false;
                try {
                    for (var disposeWatchers_1 = __values(disposeWatchers), disposeWatchers_1_1 = disposeWatchers_1.next(); !disposeWatchers_1_1.done; disposeWatchers_1_1 = disposeWatchers_1.next()) {
                        var d = disposeWatchers_1_1.value;
                        d.dispose();
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (disposeWatchers_1_1 && !disposeWatchers_1_1.done && (_d = disposeWatchers_1.return)) _d.call(disposeWatchers_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
            var e_3, _c, e_4, _d;
        };
        AtomWatcher.prototype.toString = function () {
            return this.func.toString();
        };
        /**
         * This will dispose and unregister all watchers
         *
         * @memberof AtomWatcher
         */
        AtomWatcher.prototype.dispose = function () {
            try {
                for (var _a = __values(this.path), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var p = _b.value;
                    try {
                        for (var p_1 = __values(p), p_1_1 = p_1.next(); !p_1_1.done; p_1_1 = p_1.next()) {
                            var op = p_1_1.value;
                            if (op.watcher) {
                                op.watcher.dispose();
                                op.watcher = null;
                                op.target = null;
                            }
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (p_1_1 && !p_1_1.done && (_c = p_1.return)) _c.call(p_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                }
                finally { if (e_6) throw e_6.error; }
            }
            this.func = null;
            this.path.length = 0;
            this.path = null;
            var e_6, _d, e_5, _c;
        };
        return AtomWatcher;
    }());
    exports.AtomWatcher = AtomWatcher;
});
//# sourceMappingURL=atom-watcher.js.map