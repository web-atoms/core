import { AtomOnce } from "../../core/AtomOnce";
import { Assert } from "../../unit/Assert";
import { AtomTest } from "../../unit/AtomTest";
import { Test } from "../../unit/Test";

export class AtomOnceTest extends AtomTest {

    private a: AtomOnce = new AtomOnce();

    private isRunning: boolean = false;

    @Test
    public async promise(): Promise<void> {
        await this.runPromise(false);
        Assert.isFalse((this.a as any).isRunning);
        await this.runPromise(true);
        Assert.isFalse((this.a as any).isRunning);
    }

    private async runPromise(fail: boolean): Promise<void> {
        if (this.isRunning) {
            throw new Error("Already running");
        }
        this.isRunning = true;
        await this.a.run(() => this.run(fail));
        this.isRunning = false;
    }

    private async run(fail: boolean): Promise<void> {
        await this.a.run(() => this.runPromise(fail));
        if (fail) {
            throw new Error("failed");
        }
    }

}
