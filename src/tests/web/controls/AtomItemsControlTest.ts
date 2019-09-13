import Assert from "@web-atoms/unit-test/dist/Assert";
import Category from "@web-atoms/unit-test/dist/Category";
import Test from "@web-atoms/unit-test/dist/Test";
import "test-dom";
import { App } from "../../../App";
import { Atom } from "../../../Atom";
import { BindableProperty } from "../../../core/BindableProperty";
import { AtomTest } from "../../../unit/AtomTest";
import { AtomViewModel, waitForReady } from "../../../view-model/AtomViewModel";
import { AtomControl } from "../../../web/controls/AtomControl";
import { AtomItemsControl } from "../../../web/controls/AtomItemsControl";

interface IMovie {
    label: string;
    value: string;
}

class TestViewModel extends AtomViewModel {

    @BindableProperty
    public movies: IMovie[];

    @BindableProperty
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

    constructor(app: App, e?: HTMLElement) {
        super(app, e || document.createElement("span"));
    }

    public create(): void {
        super.create();
        this.bind(this.element, "text", [["data", "label"]]);
    }

}

@Category("AtomItemsControl")
export class TestCase extends AtomTest {

    @Test("items")
    public async items(): Promise<any> {

        const root = document.createElement("div");

        const ic = new AtomItemsControl(this.app, root);

        ic.itemTemplate = TestItemTemplate;

        const vm = new TestViewModel(this.app);

        ic.viewModel = vm;

        ic.bind(null, "items", [["viewModel", "movies"]]);

        await waitForReady(vm);

        await this.app.waitForPendingCalls();

        await Atom.delay(20);

        const first = root.firstElementChild;

        Assert.equals("Movie1", first.textContent);

        const second = first.nextElementSibling;
        Assert.equals("Movie2", second.textContent);
    }

    @Test("selectedItem")
    public async selectedItem(): Promise<any> {

        const root = document.createElement("div");

        const ic = new AtomItemsControl(this.app, root);

        ic.itemTemplate = TestItemTemplate;
        ic.valuePath = "value";
        const vm = new TestViewModel(this.app);

        await waitForReady(vm);

        ic.viewModel = vm;

        ic.bind(ic.element, "items", [["viewModel", "movies"]]);
        ic.bind(null, "selectedItem", [["viewModel", "selectedMovie"]], true);

        ic.selectedItem = vm.movies[0];

        Assert.equals("movie1", ic.value);

        Assert.equals(vm.selectedMovie, vm.movies[0]);

        vm.selectedMovie = vm.movies[1];
        Assert.equals("movie2", ic.value);
    }

    @Test("selectedItems")
    public async selectedItems(): Promise<any> {

        const root = document.createElement("div");

        const ic = new AtomItemsControl(this.app, root);

        ic.itemTemplate = TestItemTemplate;
        ic.valuePath = "value";
        const vm = new TestViewModel(this.app);

        await waitForReady(vm);

        ic.viewModel = vm;

        ic.bind(null, "items", [["viewModel", "movies"]]);

        ic.selectedItems.add(vm.movies[0]);

        Assert.equals("movie1", ic.value);

        ic.selectedItem = vm.movies[1];

        Assert.equals("movie2", ic.value);
    }

}
