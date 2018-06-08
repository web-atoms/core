import { IClassOf } from "../core/types";
import { AtomControl } from "./AtomControl";

export class AtomWindow extends AtomControl {

    public windowTemplate: IClassOf<AtomControl>;

    public commandTemplate: IClassOf<AtomControl>;

}
