import { Assert, Category, Test, TestItem } from "../unit/base-test";

import "test-dom";
import { AtomBinder, IWatchableObject } from "../core/atom-binder";
import { AtomDevice } from "../core/atom-device";
import "../core/atom-list";
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

    @bindableProperty
    public selectedMovie: IMovie;

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

        ic.itemTemplate = TestItemTemplate;

        const vm = new TestViewModel();

        await vm.waitForReady();

        ic.viewModel = vm;

        ic.bind(null, "items", ["viewModel.movies"]);

        const first = root.firstElementChild;

        Assert.equals("Movie1", first.textContent);

        const second = first.nextElementSibling;
        Assert.equals("Movie2", second.textContent);
    }

    @Test("selectedItem")
    public async selectedItem(): Promise<any> {

        const root = document.createElement("div");

        const ic = new AtomItemsControl(root);

        ic.itemTemplate = TestItemTemplate;
        ic.valuePath = "value";
        const vm = new TestViewModel();

        await vm.waitForReady();

        ic.viewModel = vm;

        ic.bind(null, "items", ["viewModel.movies"]);
        ic.bind(null, "selectedItem", ["viewModel.selectedMovie"], true);

        ic.selectedItem = vm.movies[0];

        Assert.equals("movie1", ic.value);

        Assert.equals(vm.selectedMovie, vm.movies[0]);

        vm.selectedMovie = vm.movies[1];
        Assert.equals("movie2", ic.value);
    }

    @Test("selectedItems")
    public async selectedItems(): Promise<any> {

        const root = document.createElement("div");

        const ic = new AtomItemsControl(root);

        ic.itemTemplate = TestItemTemplate;
        ic.valuePath = "value";
        const vm = new TestViewModel();

        await vm.waitForReady();

        ic.viewModel = vm;

        ic.bind(null, "items", ["viewModel.movies"]);

        ic.selectedItems.add(vm.movies[0]);

        Assert.equals("movie1", ic.value);

        ic.selectedItem = vm.movies[1];

        Assert.equals("movie2", ic.value);
    }

}
