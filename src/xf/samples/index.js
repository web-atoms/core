/// <reference path="../../../node_modules/web-atoms-amd-loader/umd.js"/>



UMD.map("reflect-metadata","https://cdn.jsdelivr.net/npm/reflect-metadata@0.1.12/Reflect.js");
UMD.map("web-atoms-core","http://192.168.1.105:8080/");
UMD.loadView(
    "web-atoms-core/dist/xf/samples/views/MovieList",
    true,
    "web-atoms-core/dist/xf/XFApp")
    .then(function() {})
    .catch(function(e) {
        console.error(e);
    });