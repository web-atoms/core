import { bindableProperty } from "../core/bindable-properties";
import { IClassOf } from "../core/types";
import { AtomControl } from "./AtomControl";

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

    public onUpdateUI(): void {
        this.removeAllChildren(this.element);

        const tokens = this.order.split(",").map( (x) => x.trim());

        for (let iterator of tokens) {
            const resizable = iterator.startsWith("@");
            if (resizable) {
                iterator = iterator.substr(1);
            }
            switch (iterator) {
                case "left":
                    break;
                case "top":
                    break;
                case "right":
                    break;
                case "bottom":
                    break;
                case "fill":
                    break;
            }
        }
    }
}
