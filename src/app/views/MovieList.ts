import { AtomControl } from "../../controls/AtomControl";
import { AtomItemsControl } from "../../controls/AtomItemsControl";

export class MovieList extends AtomItemsControl {

    protected create(): void {
        this.element = document.createElement("ul");
        this.itemTemplate = MovieListItemTemplate;
        this.bind(this.element, "items", [["viewModel", "movies"]], false);
        this.bind(this.element, "selectedItem", [["viewModel", "selectedMovie"]], true);
        this.init();
    }
}

class MovieListItemTemplate extends AtomControl {

    protected create(): void {
        this.element = document.createElement("li");
        this.bind(this.element, "text", [["data", "label"], ["data", "category"]], false,
            (label, category) => `${label} (${category})`);
        this.bind(this.element, "styleFontWeight",
            [["data"], ["viewModel", "selectedMovie"]], false,
            (d, s) => {
                return d === s ? "bold" : "";
            });
        this.bindEvent(this.element, "click", (e) => {
            this.viewModel.onItemClick(this.data);
        });
    }
}
