import { ArrayHelper, IClassOf, INameValuePairs } from "../../core/types";
import { AtomStyleClass } from "./AtomStyleClass";
import { AtomStyleSheet } from "./AtomStyleSheet";

export type StyleItem = AtomStyle | AtomStyleClass;

export interface IAtomStyle {
    name: string;
}

export class AtomStyle
    implements IAtomStyle {

    private children: StyleItem[] = [];

    constructor(
        public styleSheet: AtomStyleSheet,
        public readonly parent: AtomStyle,
        public readonly name: string
    ) {
    }

    public createClass(name: string, props: INameValuePairs): AtomStyleClass {
        return this.replace(new AtomStyleClass(this.styleSheet, this, `${this.name}-${name}`, props));
    }

    public createStyle<T extends AtomStyle>(c: IClassOf<T>, name: string): T {
        return this.replace(new (c)(this.styleSheet, this, `${this.name}-${name}`));
    }

    public replace<T extends IAtomStyle>(item: T): T {
        ArrayHelper.remove(this.children, (x) => x.name === item.name);
        this.children.push(item as any);
        return item;
    }

    public toStyle(pairs?: INameValuePairs): INameValuePairs {

        pairs = pairs || {};

        for (const element of this.children) {

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

}
