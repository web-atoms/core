import { Assert, Category, Test, TestItem } from "../unit/base-test";

import "test-dom";
import { bindableProperty } from "../core/bindable-properties";
import { AtomControl } from "./atom-control";

class TestViewModel {

    @bindableProperty
    public name: any;
}

@Category("Atom-Control")
export class AtomControlTests extends TestItem {

    @Test()
    public test1(): void {
        const root = document.createElement("div");
        const control = new AtomControl(root);

        const tv = new TestViewModel();
        tv.name = "a";
        control.viewModel = tv;

        control.bind(root, "data", ["viewModel.name"], true);

        Assert.equals("a", control.data);

        tv.name = "b";

        Assert.equals("b", control.data);

        control.data = "d";

        Assert.equals("d", tv.name);

        control.viewModel = new TestViewModel();

        tv.name = "c";

        Assert.equals(undefined, control.data);

    }

}
