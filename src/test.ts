// tslint:disable:no-console
import { TestContext, TestRunner } from "./unit/base-test";

// import unit test modules here
import "./core/atom-ui-tests";

// import "./controls/atom-control-tests";
// import "./controls/atom-items-control-tests";
// import "./di/tests";
import "./styles/tests";
// import "./view-model/test";

const instance: TestRunner = TestRunner.instance;

// export Atom;
declare var process: any;

instance.run().then(() => {
    console.log("Tests ran successfully.");
    process.exit();
}).catch( (e) => {
    console.error(e);
    process.abort();
});
