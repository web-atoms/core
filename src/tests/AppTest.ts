import { App } from "../App";
import { Atom } from "../Atom";
import { CancelToken } from "../core/types";
import { Assert } from "../unit/Assert";
import { AtomTest } from "../unit/AtomTest";
import { Test } from "../unit/Test";

class TestApp extends App {

    protected onReady(f: () => void): void {
        f();
    }

}

export class AppTest extends AtomTest {

    @Test
    public async broadcastReceiveTest(): Promise<any> {

        const app = new TestApp();

        await this.delay(100);

        let message = null;

        const d = app.subscribe("channel", (c, m) => {
            message = m;
        });

        const d2 = app.subscribe("channel", (c, m) => {
            message = m;
        });

        app.broadcast("channel", "hellow world");

        Assert.equals("hellow world", message);

        app.broadcast("nothing", "nothing");

        app.main();

        d.dispose();
        d2.dispose();
    }

    @Test
    public async runAsync(): Promise<any> {
        const app = new TestApp();

        app.runAsync( async () => {
            await this.delay(10);
        });

        const ct = new CancelToken();
        ct.cancel();

        app.runAsync( async () => {
            await Atom.delay(10, ct);
        });
    }
}
