import { TestContext, TestRunner } from "./unit/base-test";

// import unit test module
import * as AtomUITests from "./core/atom-ui-tests";

var instance:TestRunner = TestRunner.instance;


// register unit test class
instance.discover(AtomUITests);




export function test(): Promise<any> {
    return instance.run();
}

// export Atom;