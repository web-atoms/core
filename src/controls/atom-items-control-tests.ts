import { Assert, Category, Test, TestItem } from "../unit/base-test";

import "test-dom";
import { App } from "../App";
import "../core/AtomList";
import { bindableProperty } from "../core/bindable-properties";
import { AtomViewModel } from "../view-model/AtomViewModel";
import { AtomControl } from "./AtomControl";
import { AtomItemsControl } from "./AtomItemsControl";

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
        this.bind(this.element, "textContent", [["data", "label"]]);
    }

}

@Category("AtomItemsControl")
export class TestCase extends TestItem {

    @Test("items")
    public async items(): Promise<any> {

        const app = new App();

        const root = document.createElement("div");

        const ic = new AtomItemsControl(root);

        ic.itemTemplate = TestItemTemplate;

        const vm = new TestViewModel(app);

        ic.viewModel = vm;

        ic.bind(null, "items", [["viewModel", "movies"]]);

        await vm.waitForReady();

        const first = root.firstElementChild;

        Assert.equals("Movie1", first.textContent);

        const second = first.nextElementSibling;
        Assert.equals("Movie2", second.textContent);
    }

    @Test("selectedItem")
    public async selectedItem(): Promise<any> {

        const app = new App();

        const root = document.createElement("div");

        const ic = new AtomItemsControl(root);

        ic.itemTemplate = TestItemTemplate;
        ic.valuePath = "value";
        const vm = new TestViewModel(app);

        await vm.waitForReady();

        ic.viewModel = vm;

        ic.bind(null, "items", [["viewModel", "movies"]]);
        ic.bind(null, "selectedItem", [["viewModel", "selectedMovie"]], true);

        ic.selectedItem = vm.movies[0];

        Assert.equals("movie1", ic.value);

        Assert.equals(vm.selectedMovie, vm.movies[0]);

        vm.selectedMovie = vm.movies[1];
        Assert.equals("movie2", ic.value);
    }

    @Test("selectedItems")
    public async selectedItems(): Promise<any> {

        const app = new App();

        const root = document.createElement("div");

        const ic = new AtomItemsControl(root);

        ic.itemTemplate = TestItemTemplate;
        ic.valuePath = "value";
        const vm = new TestViewModel(app);

        await vm.waitForReady();

        ic.viewModel = vm;

        ic.bind(null, "items", [["viewModel", "movies"]]);

        ic.selectedItems.add(vm.movies[0]);

        Assert.equals("movie1", ic.value);

        ic.selectedItem = vm.movies[1];

        Assert.equals("movie2", ic.value);
    }

}
