import Assert from "@web-atoms/unit-test/dist/Assert";
import Category from "@web-atoms/unit-test/dist/Category";
import Test from "@web-atoms/unit-test/dist/Test";
import { Atom } from "../../../Atom";
import { AtomBinder, IWatchableObject } from "../../../core/AtomBinder";
import { AtomComponent } from "../../../core/AtomComponent";
import { AtomDispatcher } from "../../../core/AtomDispatcher";
import { AtomWatcher } from "../../../core/AtomWatcher";
import { BindableProperty } from "../../../core/BindableProperty";
import WebImage from "../../../core/WebImage";
import { AtomTest } from "../../../unit/AtomTest";
import { AtomControl } from "../../../web/controls/AtomControl";
import { AtomItemsControl } from "../../../web/controls/AtomItemsControl";
import AtomWebTest from "../../../unit/AtomWebTest";

class TestViewModel {

    @BindableProperty
    public name: any = "";
}

@Category("Atom-Control")
export class AtomControlTests extends AtomWebTest {

    @Test
    public async test1(): Promise<any> {

        const root = document.createElement("div");
        const control = new AtomControl(this.app, root);

        const tv = new TestViewModel();
        tv.name = "a";
        control.viewModel = tv;

        control.bind(root, "data", [["viewModel", "name"]], true);

        await this.app.waitForPendingCalls();

        const watches = AtomBinder.get_WatchHandler(tv as IWatchableObject, "name");
        Assert.equals(watches.length, 1);

        Assert.equals("a", control.data);

        tv.name = "b";

        Assert.equals("b", control.data);

        control.data = "d";

        Assert.equals("d", tv.name);

        control.viewModel = new TestViewModel();

        tv.name = "c";

        Assert.equals("", control.data);

        Assert.equals(control, (root as any).atomControl);

        control.dispose();

        Assert.equals(null, control.element);

        Assert.equals(watches.length, 0);

        Assert.equals((control as any).bindings, null);
    }

    @Test
    public async testElements(): Promise<void> {
        const root = document.createElement("div");
        const input = document.createElement("input");
        const control = new AtomControl(this.app, root);

        const tv = new TestViewModel();
        tv.name = "a";
        control.viewModel = tv;

        control.append(input);
        control.bind(input, "value", [["viewModel", "name"]], false);

        await this.app.waitForPendingCalls();

        Assert.equals("a", input.value);

        // two way binding
        control.bind(input, "value", [["viewModel", "name"]], true);
        Assert.equals("a", input.value);

        input.value = "b";
        Assert.equals("b", input.value);
    }

    @Test
    public async instanceOf(): Promise<void> {

        const a = new AtomItemsControl(this.app, document.createElement("UL"));

        Assert.isTrue(a instanceof AtomControl);
        Assert.isTrue(a instanceof AtomComponent);
        Assert.isTrue(a instanceof AtomItemsControl);
    }

    @Test
    public resolve(): void {
        const a = this.app.get(AtomControl);

        Assert.isTrue(a ? true : false);

        a.dispose();
    }

    @Test
    public async parent(): Promise<any> {

        const root = new AtomControl(this.app);

        const child = new AtomControl(this.app);

        const rootChild = document.createElement("div");

        root.append(rootChild);

        rootChild.appendChild(child.element);

        await this.app.waitForPendingCalls();

        Assert.equals(root, child.parent);

        root.updateSize();

        await this.app.waitForPendingCalls();

        root.dispose();

    }

    @Test
    public async setElementValue(): Promise<any> {

        const root = new AtomControl(this.app);

        root.setPrimitiveValue(root.element, "row", 1);

        root.runAfterInit(() => {
            root.setLocalValue(root.element, "text", "text");
        });

        await this.app.waitForPendingCalls();

        root.runAfterInit(() => {
            root.setLocalValue(root.element, "styleClass", "class");
            root.setLocalValue(root.element, "styleDisplay", "inline-block");
            root.setLocalValue(root.element, "styleClass", {
                className: "class2"
            });
            root.setLocalValue(root.element, "styleClass", null);
        });

        // tslint:disable-next-line:no-string-literal
        Assert.equals(1, root.element["row"]);

        Assert.equals("text", root.element.textContent);

        Assert.equals("inline-block", root.element.style.display);

        root.setLocalValue(root.element, "class", "a");

        Assert.equals("a", root.element.className);

        await this.app.waitForPendingCalls();

        root.dispose();
    }

    @Test
    public async setStyle(): Promise<any> {
        const root = new AtomControl(this.app);

        root.runAfterInit(() => {
            root.setLocalValue(root.element, "style", "display: inline-block");
        });

        await this.app.waitForPendingCalls();

        Assert.equals("inline-block", root.element.style.display);

        root.dispose();
    }

    @Test
    public async setWebImage(): Promise<any> {
        const image = new WebImage("/a.png");

        const root = new AtomControl(this.app);

        root.runAfterInit(() => {
            root.setLocalValue(root.element, "styleBackgroundImage", image);
        });

        await this.app.waitForPendingCalls();

        Assert.equals("url(/a.png)", root.element.style.backgroundImage );

        root.dispose();
    }

    @Test
    public async setEvent(): Promise<any> {

        const root = new AtomControl(this.app);

        document.body.appendChild(root.element);

        let b: boolean = false;

        root.runAfterInit(() => {
            root.setLocalValue(root.element, "eventClick", () => {
                // came here...
                b = true;
            });
        });

        await this.app.waitForPendingCalls();

        const MouseEvent = (window as any).MouseEvent;

        root.element.dispatchEvent(new MouseEvent("click"));

        Assert.isTrue(b);

        root.dispose();

    }

    @Test
    public async setAsyncEvent(): Promise<any> {

        const root = new AtomControl(this.app);

        document.body.appendChild(root.element);

        let b: boolean = false;

        root.runAfterInit(() => {
            root.setLocalValue(root.element, "eventClick", async () => {
                await Atom.delay(1);
                // came here...
                b = true;
            });
        });

        await this.app.waitForPendingCalls();

        const MouseEvent = (window as any).MouseEvent;

        root.element.dispatchEvent(new MouseEvent("click"));

        await this.app.waitForPendingCalls();

        await Atom.delay(20);

        Assert.isTrue(b);

        root.dispose();

    }

    @Test
    public async setAsyncEventWithError(): Promise<any> {

        const root = new AtomControl(this.app);

        document.body.appendChild(root.element);

        root.runAfterInit(() => {
            root.setPrimitiveValue(root.element, "eventClick", async () => {
                await Atom.delay(1);
                throw new Error("unexpected");
            });
        });

        await this.app.waitForPendingCalls();

        const MouseEvent = (window as any).MouseEvent;

        const nav = this.navigationService;

        // nav.expectAlert("Error: unexpected");

        root.element.dispatchEvent(new MouseEvent("click"));

        root.dispose();

        await Atom.delay(10);

    }
}
