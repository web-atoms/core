import { ArrayHelper, IClassOf, INameValuePairs } from "../../core/types";
import { TypeKey } from "../../di/TypeKey";
import { AtomControl } from "../controls/AtomControl";
import { AtomStyleClass } from "./AtomStyleClass";
import { AtomStyleSheet } from "./AtomStyleSheet";
import { IStyleDeclaration } from "./IStyleDeclaration";
import { IStyleDeclarationFunc } from "./IStyleDeclarationFunc";

export type StyleItem = AtomStyle | AtomStyleClass;

export interface IAtomStyle {
    name: string;
}

export class AtomStyle
    implements IAtomStyle {

    private children: StyleItem[] = [];

    private defaults: { [key: string]: AtomStyle} = {};

    [key: string]: any;

    constructor(
        public styleSheet: AtomStyleSheet,
        public readonly parent: AtomStyle,
        public readonly name: string
    ) {
    }

    public createClass(name: string, props: IStyleDeclarationFunc): AtomStyleClass {
        return this.replace(new AtomStyleClass(this.styleSheet, this, `${this.name}-${name}`, props));
    }

    public createNamedStyle<T extends AtomStyle>(c: IClassOf<T>, name: string): T {
        return this.replace(new (c)(this.styleSheet, this, `${this.name}-${name}`));
    }

    public createStyle<TC extends AtomControl, T extends AtomStyle>(tc: IClassOf<TC>, c: IClassOf<T>, name: string): T {

        this.defaults = this.defaults || {};

        const newStyle = new (c)(this.styleSheet, this, `${this.name}-${name}`);
        const key = TypeKey.get(tc);
        this.defaults[key] = newStyle;
        return this.replace(newStyle);
    }

    public getDefaultStyle(forKey: any): AtomStyle {
        return this.defaults[TypeKey.get(forKey)];
    }

    public replace<T extends IAtomStyle>(item: T): T {
        ArrayHelper.remove(this.children, (x) => x.name === item.name);
        this.children.push(item as any);
        if (item instanceof AtomStyle) {
            const s = item as AtomStyle;
            if (!s.initialized) {
                s.init();
                s.initialized = true;
            }
        }
        this.styleSheet.pushUpdate();
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
                // for (const iterator of c.createStyle()) {
                //     pairs[iterator.key] = iterator.value;
                // }
                pairs = c.toStyle(pairs);
                continue;
            }
        }
        return pairs;
    }

    protected init(): void {
        // empty...
    }

}
