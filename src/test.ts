// tslint:disable:no-console

// import unit test modules here
import "./core/atom-ui-tests";
import "./core/AtomBinderTests";
import "./di/tests";
import "./styles/tests";
import { TestRunner } from "./unit/TestRunner";
import "./view-model/test";
import "./web/controls/atom-control-tests";
import "./web/controls/atom-items-control-tests";
import "./web/controls/AtomGridViewTests";

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
