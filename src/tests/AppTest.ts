import Assert from "@web-atoms/unit-test/dist/Assert.js";
import Test from "@web-atoms/unit-test/dist/Test.js";
import { App } from "../App.js";
import { Atom } from "../Atom.js";
import { CancelToken } from "../core/types.js";
import { MockNavigationService } from "../services/MockNavigationService.js";
import { NavigationService } from "../services/NavigationService.js";
import { AtomTest } from "../unit/AtomTest.js";

class TestApp extends App {

    constructor() {
        super();
        this.put(NavigationService, this.resolve(MockNavigationService));
    }

    protected onReady(f: () => void): void {
        f();
    }

}

export class AppTest extends AtomTest {

    @Test
    public async broadcastReceiveTest(): Promise<any> {

        const app = this.app;

        await this.delay(100);

        let message = null;

        const d = app.subscribe("channel", (c, m) => {
            message = m;
        });

        const d2 = app.subscribe("channel", (c, m) => {
            message = m;
        });

        app.broadcast("channel", "hello world");

        Assert.equals("hello world", message);

        app.broadcast("nothing", "nothing");

        app.main();

        d.dispose();
        d2.dispose();

        await Atom.delay(100);
    }

    @Test
    public async runAsync(): Promise<any> {
        const app = this.app;

        app.runAsync( async () => {
            await this.delay(10);
        });

        const ct = new CancelToken();
        ct.cancel();

        app.runAsync( async () => await Atom.delay(10, ct));

        await Atom.delay(100);
    }
}
