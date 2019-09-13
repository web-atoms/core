import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import { Atom } from "../../Atom";
import CacheService from "../../services/CacheService";
import { AtomTest } from "../../unit/AtomTest";

export class CacheServiceTest extends AtomTest {

    @Test
    public async ttlTest(): Promise<void> {
        const c = new CacheService(this.app);

        let i = 0;

        const f = async (): Promise<any> => {
            return await c.getOrCreate("a", async (ci) => {
                await Atom.delay(10);
                ci.ttlSeconds = 100 / 1000;
                return "A" + i;
            });
        };

        let r = await f();
        i ++;

        Assert.equals("A0", r);

        await Atom.delay(5);

        r = await f();
        Assert.equals("A0", r);

        await Atom.delay(200);

        r = await f();
        Assert.equals("A1", r);

    }

    @Test
    public async ttlSecondsMethod(): Promise<void> {
        const c = new CacheService(this.app);

        let i = 0;

        const n = "0";

        const f = async (): Promise<any> => {
            return await c.getOrCreate("a", async (ci) => {
                await Atom.delay(10);
                ci.ttlSeconds = (x: string) => x.endsWith(n) ? (100 / 1000) : 0;
                return "A" + i;
            });
        };

        let r = await f();
        i ++;

        Assert.equals("A0", r);

        await Atom.delay(5);

        r = await f();
        Assert.equals("A0", r);

        await Atom.delay(200);

        r = await f();
        Assert.equals("A1", r);

        i ++;
        r = await f();
        Assert.equals("A2", r);
    }

    @Test
    public async remove(): Promise<void> {
        const c = new CacheService(this.app);

        let i = 0;

        const f = async (): Promise<any> => {
            return await c.getOrCreate("a", async (ci) => {
                await Atom.delay(10);
                ci.ttlSeconds = 100 / 1000;
                return "A" + i;
            });
        };

        let r = await f();

        Assert.equals("A0", r);

        await Atom.delay(10);

        c.remove("a");

        i++;

        r = await f();

        Assert.equals("A1", r);

        Assert.isNull(c.remove("aa"));
    }

}
