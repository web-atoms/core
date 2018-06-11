import { bindableProperty } from "../core/bindable-properties";
import { IClassOf } from "../core/types";
import { AtomControl } from "./AtomControl";

class AtomWindowFrameTemplate extends AtomControl {

}

export class AtomWindow extends AtomControl {

    @bindableProperty
    public windowTemplate: IClassOf<AtomControl>;

    @bindableProperty
    public commandTemplate: IClassOf<AtomControl>;

    @bindableProperty
    public frameTemplate: IClassOf<AtomControl> = AtomWindowFrameTemplate;

    public onPropertyChanged(name: string): void {
        switch (name) {
            case "windowTemplate":
            case "commandTemplate":
            case "frameTemplate":
            break;
        }
    }

}
