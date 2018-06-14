import { PropertyMap } from "../core/PropertyMap";
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
        return new AtomStyleClass(this.styleSheet, this, `${this.name}-${name}`, props);
    }

    public createStyle<T extends AtomStyle>(c: IClassOf<T>, name: string): T {
        return new (c)(this.styleSheet, this, `${this.name}-${name}`);
    }

    public toStyle(pairs?: INameValuePairs): INameValuePairs {

        pairs = pairs || {};

        const map = PropertyMap.from(this);

        for (const iterator of map.names) {
            const element = this[iterator];

            // if it is nested style
            const style = element as AtomStyle;
            if (style && style.toStyle) {
                pairs = style.toStyle(pairs);
                continue;
            }

            // if it is class
            const c = element as AtomStyleClass;
            if (c  && c.className) {
                pairs[c.className] = c.createStyle();
                continue;
            }
        }
        return pairs;
    }

    private *toPairs(): Iterable<{ key: string, value: any}> {
        const map = PropertyMap.from(this);
        for (const key of map.names) {
            if (!/toPairs/i.test(key)) {
                const element = this[key];
                yield { key, value: element};
            }
        }
    }

}
