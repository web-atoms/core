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
import "./tests/AtomClassTest";
import "./tests/AppTest";
import "./tests/core/AtomBinderTest";
import "./tests/core/StringHelperTests";
import "./tests/core/PropertyBinderTest";
import "./tests/services/JsonServiceTest";

const instance: TestRunner = TestRunner.instance;

// export Atom;
declare var process: any;

instance.run().then(() => {
    process.exit();
}).catch( (e) => {
    console.error(e.message);
    process.abort();
});
