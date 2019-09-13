import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import { Atom } from "../../Atom";
import { AtomOnce } from "../../core/AtomOnce";
import { AtomTest } from "../../unit/AtomTest";

// export class AtomOnceTest extends AtomTest {

//     private a: AtomOnce = new AtomOnce();

//     private isRunning: boolean = false;

//     @Test
//     public async promise(): Promise<void> {
//         await this.runPromise(false);
//         Assert.isFalse((this.a as any).isRunning);
//         await this.runPromise(true);
//         Assert.isFalse((this.a as any).isRunning);
//     }

//     private async runPromise(fail: boolean): Promise<void> {
//         // tslint:disable-next-line: no-debugger
//         debugger;
//         if (this.isRunning) {
//             throw new Error("Already running");
//         }
//         this.isRunning = true;
//         this.a.run(() => this.run(fail));
//         this.isRunning = false;
//     }

//     private async run(fail: boolean): Promise<void> {
//         await Atom.delay(1);
//         this.a.run(() => this.runPromise(fail));
//         if (fail) {
//             throw new Error("failed");
//         }
//     }

// }
