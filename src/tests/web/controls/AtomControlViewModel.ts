import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import { AtomBinder, IWatchableObject } from "../../../core/AtomBinder";
import { AtomViewModel } from "../../../view-model/AtomViewModel";
import { AtomControl } from "../../../web/controls/AtomControl";
import AtomWebTest from "../AtomWebTest";

class TestViewModel extends AtomViewModel {

    public name: any = "";

}

export class AtomControlViewModel extends AtomWebTest {

    @Test
    public async parentLocalViewModel(): Promise<any> {

        const root = document.createElement("div");
        const rc = new AtomControl(this.app, root);

        const control = new AtomControl(this.app);

        rc.append(control);

        const tv = control.app.resolve(TestViewModel, true);
        tv.name = "a";
        rc.localViewModel = control.app.resolve(TestViewModel, true);

        rc.localViewModel = tv;

        control.bind(control.element, "data", [["localViewModel", "name"]], true);

        await this.app.waitForPendingCalls();

        const watches = AtomBinder.get_WatchHandler(tv as IWatchableObject, "name");
        Assert.equals(watches.length, 1);

        Assert.equals("a", control.data);

        tv.name = "b";

        Assert.equals("b", control.data);

        Assert.equals(tv, control.localViewModel);

    }

    @Test
    public async localViewModel(): Promise<any> {

        const root = document.createElement("div");

        const control = new AtomControl(this.app, root);

        const tv = control.app.resolve(TestViewModel, true);
        tv.name = "a";
        control.localViewModel = tv;

        control.bind(control.element, "data", [["localViewModel", "name"]], true);

        await this.app.waitForPendingCalls();

        const watches = AtomBinder.get_WatchHandler(tv as IWatchableObject, "name");
        Assert.equals(watches.length, 1);

        Assert.equals("a", control.data);

        tv.name = "b";

        Assert.equals("b", control.data);

        Assert.equals(tv, control.localViewModel);

    }

    @Test
    public async parentViewModel(): Promise<any> {

        const root = document.createElement("div");
        const rc = new AtomControl(this.app, root);

        const control = new AtomControl(this.app);

        rc.append(control);

        const tv = control.app.resolve(TestViewModel, true);
        tv.name = "a";
        rc.viewModel = control.app.resolve(TestViewModel, true);

        rc.viewModel = tv;

        control.bind(control.element, "data", [["viewModel", "name"]], true);

        await this.app.waitForPendingCalls();

        const watches = AtomBinder.get_WatchHandler(tv as IWatchableObject, "name");
        Assert.equals(watches.length, 1);

        Assert.equals("a", control.data);

        tv.name = "b";

        Assert.equals("b", control.data);

        Assert.equals(tv, control.viewModel);

    }

    @Test
    public async undefinedVM(): Promise<any> {

        const root = new AtomControl(this.app);

        Assert.isUndefined(root.viewModel);

        Assert.isUndefined(root.localViewModel);

    }
}
