import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";
import sleep from "../../core/sleep";
import { CancelToken } from "../../core/types";

export default class SleepTests extends TestItem {

    @Test
    public async sleep() {
        let ct = new CancelToken();
        let p = sleep(1000, ct);
        ct.cancel();
        Assert.throwsAsync("Throws", () => p);

        ct = new CancelToken();
        p = sleep(1000, ct, false);
        ct.cancel();
        await p;

        ct = new CancelToken();
        ct.cancel();
        p = sleep(1000, ct);
        Assert.throwsAsync("Throws", () => p);

        ct = new CancelToken();
        ct.cancel();
        p = sleep(1000, ct, false);
        await p;
    }

}
