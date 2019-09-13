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
// import "./tests/AtomClassTest";
// import "./tests/AppTest";
// import "./tests/core/ColorTests";
// import "./tests/core/AtomBinderTest";
// import "./tests/core/StringHelperTests";
// import "./tests/core/PropertyBinderTest";
// import "./tests/services/JsonServiceTest";
// import "./tests/web/window/WindowTest";

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
