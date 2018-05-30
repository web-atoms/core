(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./core/atom-binder", "./core/bridge", "./core/types", "./core/property-binding", "./core/atom-list", "./core/atom-ui", "./core/atom-uri", "./core/atom-watcher", "./core/bindable-properties"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(require("./core/atom-binder"));
    __export(require("./core/bridge"));
    __export(require("./core/types"));
    __export(require("./core/property-binding"));
    __export(require("./core/atom-list"));
    __export(require("./core/atom-ui"));
    __export(require("./core/atom-uri"));
    __export(require("./core/atom-watcher"));
    __export(require("./core/bindable-properties"));
});
// export * from "./core/atom-dispatcher";
//# sourceMappingURL=core.js.map