import { bindableProperty } from "../core/bindable-properties";
import { IClassOf } from "../core/types";
import { AtomControl } from "./AtomControl";
import { AtomTemplate } from "./AtomTemplate";

export class AtomDockPanel extends AtomControl {

    @bindableProperty
    public topTemplate: Array<IClassOf<AtomControl>>;

    @bindableProperty
    public leftTemplate: Array<IClassOf<AtomControl>>;

    @bindableProperty
    public rightTemplate: Array<IClassOf<AtomControl>>;

    @bindableProperty
    public bottomTemplate: Array<IClassOf<AtomControl>>;

    @bindableProperty
    public fillTemplate: IClassOf<AtomControl>;

    @bindableProperty
    public order: string = "top, @left, @right, bottom, fill";

    public onPropertyChanged(name: string): void {
        super.onPropertyChanged(name);

        if (/Template$/.test(name)) {
            this.invalidate();
        }
    }
}
