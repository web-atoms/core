import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import { Atom } from "../../../Atom";
import { CancelToken } from "../../../core/types";
import { JsonService } from "../../../services/JsonService";
import { NavigationService } from "../../../services/NavigationService";
import { AtomTest } from "../../../unit/AtomTest";
import { AtomControl } from "../../../web/controls/AtomControl";
import { AtomWindow } from "../../../web/controls/AtomWindow";
import { WindowService } from "../../../web/services/WindowService";
import AtomWebTest from "../../../unit/AtomWebTest";

function createEvent<T extends Event>(name, ... a: any[]): T {
    const e = document.createEvent(name);
    e.initEvent.apply(e, a);
    return e as any as T;
}

declare var global: any;

export class AtomWindowTest extends AtomWebTest {

    constructor() {
        super();
        const ws = new WindowService(this.app, this.app.resolve(JsonService));
        this.app.put(NavigationService, ws);
        this.app.put(WindowService, ws);
    }

    @Test
    public async drag(): Promise<any> {

        const ns = this.app.resolve(NavigationService) as NavigationService;

        const ct = new CancelToken();
        const p = ns.openPage(SampleWindow, null, { cancelToken: ct });

        await this.app.waitForPendingCalls();

        window.dispatchEvent(createEvent<MouseEvent>("mouseevent", "mousedown", true, false));
        window.dispatchEvent(createEvent<MouseEvent>("mouseevent", "mousemove", true, false));
        window.dispatchEvent(createEvent<MouseEvent>("mouseevent", "mouseup", true, false));

        ct.cancel();

        Assert.throwsAsync("cancelled", () => p);
    }

    // @Test
    public async alert(): Promise<void> {
        const ns = this.app.resolve(NavigationService) as NavigationService;
        const p = ns.alert("Test");

        await this.app.waitForPendingCalls();

        await Atom.delay(100);

        await this.app.waitForPendingCalls();
        // get yes button...
        const e = global.window.document.getElementsByClassName("yes-button")[0] as any;

        setTimeout(() => {
            e.click();
        }, (100));
        // e.click();

        await p;
    }

}

class SampleWindow extends AtomWindow {

    protected create(): void {
        this.windowTemplate = SampleWindowTemplate;
    }

}

class SampleWindowTemplate extends AtomControl {

    protected create(): void {
        this.element.className = "sample_window";
        this.element.textContent = "sample";
    }
}
