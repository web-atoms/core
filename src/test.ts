// tslint:disable:no-console
// tslint:disable:ordered-imports

declare var require: any;
declare var __dirname: any;

// import unit test modules here
import TestRunner from "@web-atoms/unit-test/dist/TestRunner";
// tslint:disable-next-line:no-var-requires
const { statSync, readdirSync } = require("fs") as any;
// tslint:disable-next-line:no-var-requires
const path = require("path");

// tslint:disable-next-line: no-var-requires
const Module = require("module");
// tslint:disable-next-line: ban-types
const oldr: Function = Module.prototype.require;
const r = function(name) {
    if (/\.(svg|jpg|gif|png)$/i.test(name)) {
        return name;
    }
    return oldr.call(this, name);
};
r.resolve = (oldr as any).resolve;
Module.prototype.require = r;

// import "./tests/AtomClassTest";
// import "./tests/AppTest";
// import "./tests/core/ColorTests";
// import "./tests/core/AtomBinderTest";
// import "./tests/core/StringHelperTests";
// import "./tests/core/PropertyBinderTest";
// import "./tests/services/JsonServiceTest";
// import "./tests/web/window/WindowTest";

declare var global: any;
(global as any).CustomEvent = function CustomEvent(type: string, p?: any) {
    const e = document.createEvent("CustomEvent");
    const pe = p ? { ... p } : {};
    e.initCustomEvent(type, pe.bubble, pe.cancelable, pe.detail);
    return e;
};

function loadScripts(start) {
    for (const item of readdirSync(start)) {
        const file = `${start}/${item}`;
        // const file = item;
        const s = statSync(file);
        if (s.isDirectory()) {
            loadScripts(file);
            continue;
        }

        if (file.endsWith(".js")) {
            const md = file.substr(0, file.length - 3);
            require("." + md);
        }
    }
}

loadScripts("./dist/tests");

const instance: TestRunner = TestRunner.instance;

// export Atom;
declare var process: any;

instance.run().then(() => {
    process.exit();
}).catch( (e) => {
    console.error(e.message);
    if (e.stack) {
        console.error(e.stack);
    }
    process.exit(1);
});
