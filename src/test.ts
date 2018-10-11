// tslint:disable:no-console
// tslint:disable:ordered-imports

// import unit test modules here
import "./core/atom-ui-tests";
import "./di/tests";
import "./web/styles/tests";
import { TestRunner } from "./unit/TestRunner";
import "./view-model/test";
import "./web/controls/atom-control-tests";
import "./web/controls/atom-items-control-tests";
import "./web/controls/AtomGridViewTests";
import { statSync, readdirSync } from "fs";
import * as path from "path";
// import "./tests/AtomClassTest";
// import "./tests/AppTest";
// import "./tests/core/ColorTests";
// import "./tests/core/AtomBinderTest";
// import "./tests/core/StringHelperTests";
// import "./tests/core/PropertyBinderTest";
// import "./tests/services/JsonServiceTest";
// import "./tests/web/window/WindowTest";

declare var require: any;
declare var __dirname: any;

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
    process.abort();
});
