// declare function require(s:string):void;
import { TestContext, TestRunner } from "./unit/base-test";

// import unit test modules here
import "./core/atom-ui-tests";

var instance:TestRunner = TestRunner.instance;


// export Atom;
declare var process:any;

instance.run().then(() => {
    console.log("Tests ran successfully.");
    process.exit();
}).catch(e=>{
    console.error(e);
    process.abort();
});

