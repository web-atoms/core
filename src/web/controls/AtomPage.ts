import { BindableProperty } from "../../core/BindableProperty.js";
import { AtomControl } from "./AtomControl.js";

export class AtomPage extends AtomControl {

    public title: string;

    public tag: string;

    public preCreate(): void {
        this.title = null;
        this.tag = null;
        this.bind(this.element, "title", [["viewModel", "title"]]);
    }

}
