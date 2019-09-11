import { App } from "../../../../App";
import { AtomControl } from "../../../controls/AtomControl";
import { AtomGridSplitter } from "../../../controls/AtomGridSplitter";
import { AtomGridView } from "../../../controls/AtomGridView";
import { AtomItemsControl } from "../../../controls/AtomItemsControl";

export class MovieList extends AtomGridView {

    protected create(): void {

        const style = this.element.style;
        style.position = "absolute";
        style.left = style.right = style.top = style.bottom = "0";

        this.setPrimitiveValue(this.element, "columns", "30%,5,*");
        this.setPrimitiveValue(this.element, "rows", "30,*");

        const header = document.createElement("header");
        header.textContent = "Header";
        this.setPrimitiveValue(header, "cell", "0:3,0");
        this.append(header);

        const ul = new AtomItemsControl(this.app, document.createElement("ul"));
        this.append(ul);
        ul.itemTemplate = MovieListItemTemplate;
        ul.bind(ul.element, "items", [["viewModel", "movies"]], false);
        ul.bind(ul.element, "selectedItem", [["viewModel", "selectedMovie"]], true);

        ul.setPrimitiveValue(ul.element, "cell", "0,1");

        // const e = document.createElement("span");
        // this.append(e);
        // e.style.color = "red";
        // this.bind(e, "text", [["viewModel", "errorSelectedMovie"]]);

        const right = document.createElement("div");
        right.textContent = "right";
        right.style.backgroundColor = "green";
        this.setPrimitiveValue(right, "cell", "2,1");
        this.append(right);

        const splitter = new AtomGridSplitter(this.app);
        this.append(splitter);
        splitter.setPrimitiveValue(splitter.element, "cell", "1,1");
    }
}

class MovieListItemTemplate extends AtomControl {

    constructor(app: App, e?: HTMLElement) {
        super(app, e || document.createElement("li"));
    }

    protected create(): void {
        this.element.style.margin = "2px";
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
        button.textContent = "Delete";
        button.style.marginLeft = "10px";
        this.bindEvent(button, "click", (e) => {
            this.viewModel.onDelete(this.data);
        });
    }
}
