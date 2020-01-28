import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import DISingleton from "../../di/DISingleton";
import { AtomTest } from "../../unit/AtomTest";

export default class DIGlobalTest extends AtomTest {

    @Test
    public test() {
        const a = this.app.resolve(GlobalService) as GlobalService;

        const r = a.getName();

        Assert.equals("this is global service", r);
    }

}

declare var global;

global.globalServiceImpl = {
    getName() {
        return "this is global service";
    }
};

@DISingleton({ globalVar: "globalServiceImpl" })
class GlobalService {

    public getName(): string {
        throw new Error("Not implemented");
    }
}
