import { IClassOf, INameValuePairs } from "../core/types";
import { AtomViewModel } from "../view-model/AtomViewModel";
import { AtomStyleClass } from "./AtomStyleClass";
import { AtomStyleSheet } from "./AtomStyleSheet";

export class AtomStyle extends AtomViewModel {

    constructor(
        public styleSheet: AtomStyleSheet,
        public readonly parent: AtomStyle,
        public readonly name: string
    ) {
        super();
    }

    public createClass(name: string, props: INameValuePairs ): AtomStyleClass {
        return new AtomStyleClass(this.styleSheet, this, name, props);
    }

    public createStyle<T extends AtomStyle>(c: IClassOf<T>, name: string): T {
        return new (c)(this.styleSheet, this, name);
    }

}
