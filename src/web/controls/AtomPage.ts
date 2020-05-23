import { BindableProperty } from "../../core/BindableProperty";
import { AtomControl } from "./AtomControl";

export class AtomPage extends AtomControl {

    public title: string;

    public tag: string;

    public preCreate(): void {
        this.title = null;
        this.tag = null;
        this.bind(this.element, "title", [["viewModel", "title"]]);
    }

}
