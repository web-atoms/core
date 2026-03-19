import Assert from "@web-atoms/unit-test/dist/Assert.js";
import Test from "@web-atoms/unit-test/dist/Test.js";
import DISingleton from "../../di/DISingleton.js";
import { AtomTest } from "../../unit/AtomTest.js";

export default class DIGlobalTest extends AtomTest {

    @Test
    public test() {
        const a = this.app.resolve(GlobalService) as GlobalService;

        const r = a.getName();

        Assert.equals("this is global service", r);
    }

}

declare var global;

global.a = {};

global.a.globalServiceImpl = {
    getName() {
        return "this is global service";
    }
};

@DISingleton({ globalVar: "a.globalServiceImpl" })
class GlobalService {

    public getName(): string {
        throw new Error("Not implemented");
    }
}
