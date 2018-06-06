import { Assert, Category, Test, TestItem } from "../unit/base-test";

import "test-dom";
import { AtomBinder, IWatchableObject } from "../core/atom-binder";
import { AtomDevice } from "../core/atom-device";
import { bindableProperty } from "../core/bindable-properties";
import { Container } from "../di";
import { AtomViewModel } from "../view-model/atom-view-model";
import { AtomControl } from "./atom-control";
import { AtomItemsControl } from "./atom-items-control";

interface IMovie {
    label: string;
    value: string;
}

class TestViewModel extends AtomViewModel {

    @bindableProperty
    public movies: IMovie[];

    public async init(): Promise<any> {
        this.movies = [
            {
                label: "Movie1",
                value: "movie1"
            },
            {
                label: "Movie2",
                value: "movie2"
            }
        ];
    }

}

class TestItemTemplate extends AtomControl {

    public create(): void {
        super.create();

        this.element = document.createElement("span");
        this.bind(this.element, "textContent", ["data.label"]);
    }

}

@Category("AtomItemsControl")
export class TestCase extends TestItem {

    @Test("items")
    public async items(): Promise<any> {
        const root = document.createElement("div");

        const ic = new AtomItemsControl(root);

        const vm = new TestViewModel();

        await vm.waitForReady();

        ic.viewModel = vm;

        ic.bind(null, "items", ["viewModel.movies"]);

        const first = root.firstElementChild;

        Assert.equals("Movie1", first.textContent);
    }

}
