import { IClassOf } from "../../core/types";
import { AtomControl } from "./AtomControl";
import { AtomFormField } from "./AtomFormField";

export class AtomForm extends AtomControl {

    public fieldTemplate: IClassOf<AtomControl>;

    public children: AtomControl[] = [];

    public append(e: AtomControl | HTMLElement | Text): AtomControl {

        if (!(e instanceof AtomFormField)) {
            throw new Error(`Only AtomFormField can be added inside AtomForm`);
        }
        return super.append(e);
    }
}
