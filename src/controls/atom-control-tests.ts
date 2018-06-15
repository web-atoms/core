import { Assert, Category, Test, TestItem } from "../unit/base-test";

import "test-dom";
import { AtomBinder, IWatchableObject } from "../core/AtomBinder";
import { bindableProperty } from "../core/bindable-properties";
import { AtomControl } from "./AtomControl";

class TestViewModel {

    @bindableProperty
    public name: any = "";
}

@Category("Atom-Control")
export class AtomControlTests extends TestItem {

    @Test()
    public async test1(): Promise<any> {
        const root = document.createElement("div");
        const control = new AtomControl(root);

        const tv = new TestViewModel();
        tv.name = "a";
        control.viewModel = tv;

        control.bind(root, "data", [["viewModel", "name"]], true);

        await this.delay(100);

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

    @Test()
    public async testElements(): Promise<void> {
        const root = document.createElement("div");
        const input = document.createElement("input");
        const control = new AtomControl(root);

        const tv = new TestViewModel();
        tv.name = "a";
        control.viewModel = tv;

        control.append(input);
        control.bind(input, "value", [["viewModel", "name"]], false);

        await this.delay(100);

        Assert.equals("a", input.value);

        // two way binding
        control.bind(input, "value", [["viewModel", "name"]], true);
        Assert.equals("a", input.value);

        input.value = "b";
        Assert.equals("b", input.value);
    }

}
