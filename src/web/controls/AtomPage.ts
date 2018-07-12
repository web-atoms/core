import { BindableProperty } from "../../core/BindableProperty";
import { AtomControl } from "./AtomControl";

export class AtomPage extends AtomControl {

    @BindableProperty
    public title: string;

    @BindableProperty
    public tag: string;

    public preCreate(): void {
        this.bind(this.element, "title", [["viewModel", "title"]]);
    }

}
