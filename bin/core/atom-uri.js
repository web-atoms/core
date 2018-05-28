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
    var AtomUri = /** @class */ (function () {
        /**
         *
         */
        function AtomUri(url) {
            this.atomUi = new atom_ui_1.AtomUI();
            var path;
            var query = "";
            var hash = "";
            var t = url.split("?");
            path = t[0];
            if (t.length === 2) {
                query = t[1] || "";
                t = query.split("#");
                query = t[0];
                hash = t[1] || "";
            }
            else {
                t = path.split("#");
                path = t[0];
                hash = t[1] || "";
            }
            // extract protocol and domain...
            var scheme = location.protocol;
            var host = location.host;
            var port = location.port;
            var i = path.indexOf("//");
            if (i !== -1) {
                scheme = path.substr(0, i);
                path = path.substr(i + 2);
                i = path.indexOf("/");
                if (i !== -1) {
                    host = path.substr(0, i);
                    path = path.substr(i + 1);
                    t = host.split(":");
                    if (t.length > 1) {
                        host = t[0];
                        port = t[1];
                    }
                }
            }
            this.host = host;
            this.protocol = scheme;
            this.port = port;
            this.path = path;
            this.query = this.atomUi.parseUrl(query);
            this.hash = this.atomUi.parseUrl(hash);
        }
        return AtomUri;
    }());
    exports.AtomUri = AtomUri;
});
//# sourceMappingURL=atom-uri.js.map