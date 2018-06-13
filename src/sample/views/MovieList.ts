import { AtomControl } from "../../controls/AtomControl";
import { AtomItemsControl } from "../../controls/AtomItemsControl";

export class MovieList extends AtomControl {

    protected create(): void {
        this.element = document.createElement("div");

        const ul = new AtomItemsControl(document.createElement("ul"));
        this.append(ul);
        ul.itemTemplate = MovieListItemTemplate;
        ul.bind(ul.element, "items", [["viewModel", "movies"]], false);
        ul.bind(ul.element, "selectedItem", [["viewModel", "selectedMovie"]], true);

        this.init();
    }
}

class MovieListItemTemplate extends AtomControl {

    protected create(): void {
        this.element = document.createElement("li");

        const span = document.createElement("span");
        this.append(span);
        this.bind(span, "text", [["data", "label"], ["data", "category"]], false,
            (label, category) => `${label} (${category})`);
        this.bind(span, "styleFontWeight",
            [["data"], ["viewModel", "selectedMovie"]], false,
            (d, s) => {
                return d === s ? "bold" : "";
            });
        this.bindEvent(span, "click", (e) => {
            this.viewModel.onItemClick(this.data);
        });

        const button = document.createElement("button");
        this.append(button);
        this.bindEvent(button, "click", (e) => {
            this.viewModel.onDelete(this.data);
        });
    }
}
