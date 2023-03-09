import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";
import sleep from "../../core/sleep";
import { CancelToken } from "../../core/types";

export default class TypesTest extends TestItem {

    @Test
    public isCancelled() {
        Assert.isTrue(CancelToken.isCancelled("") === void 0);
        Assert.isTrue(CancelToken.isCancelled("cancelled"));
        Assert.isTrue(CancelToken.isCancelled("canceled"));
        Assert.isTrue(CancelToken.isCancelled("AbortError:"));
        Assert.isTrue(CancelToken.isCancelled({ name: "AbortError" }));
    }

    @Test
    public async timeout() {
        let ct = new CancelToken(100);
        Assert.isTrue(!ct.cancelled);
        await sleep(200);
        Assert.isFalse(!ct.cancelled);

        ct.reset();
        Assert.isTrue(!ct.cancelled);

        ct = new CancelToken(300);
        Assert.isTrue(!ct.cancelled);
        await sleep(200);
        ct.reset();
        Assert.isTrue(!ct.cancelled);
        await sleep(200);
        Assert.isTrue(!ct.cancelled);
    }
}
