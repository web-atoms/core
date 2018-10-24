import { Atom } from "../../Atom";
import CacheService from "../../services/CacheService";
import { Assert } from "../../unit/Assert";
import { AtomTest } from "../../unit/AtomTest";
import { Test } from "../../unit/Test";

export class CacheServiceTest extends AtomTest {

    @Test
    public async ttlTest(): Promise<void> {
        const c = new CacheService(this.app);

        let i = 0;

        const f = async (): Promise<any> => {
            return await c.getOrCreate("a", async (ci) => {
                await Atom.delay(10);
                ci.ttlSeconds = 100;
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

}
