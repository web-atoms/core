import { IClassOf } from "../core/types";
import { AtomControl } from "./AtomControl";

class AtomWindowFrameTemplate extends AtomControl {

}

export class AtomWindow extends AtomControl {

    public windowTemplate: IClassOf<AtomControl>;

    public commandTemplate: IClassOf<AtomControl>;

    public frameTemplate: IClassOf<AtomControl> = AtomWindowFrameTemplate;

}
