import { Atom } from "../../../Atom";
import { AtomTest } from "../../../unit/AtomTest";
import { Test } from "../../../unit/Test";
import { AtomControl } from "../../../web/controls/AtomControl";
import { AtomWindow } from "../../../web/controls/AtomWindow";
import AtomWebTest from "../AtomWebTest";

export class AtomWindowTest extends AtomWebTest {

    @Test
    public async drag(): Promise<any> {

        const win = new SampleWindow(this.app);

        await this.app.waitForPendingCalls();

        // window.dispatchEvent(new MouseEvent("mousedown"));
        // window.dispatchEvent(new MouseEvent("mousemove"));
        // window.dispatchEvent(new MouseEvent("mouseup"));

        win.dispose();

    }

}

class SampleWindow extends AtomWindow {

    protected create(): void {
        this.windowTemplate = SampleWindowTemplate;
    }

}

class SampleWindowTemplate extends AtomControl {

    protected create(): void {
        this.element.textContent = "sample";
    }
}
