import { StringHelper } from "../../core/StringHelper";
import { IClassOf, INameValuePairs } from "../../core/types";
import { TypeKey } from "../../di/TypeKey";
import { AtomControl } from "../controls/AtomControl";
import { AtomStyleSheet } from "./AtomStyleSheet";
import { IStyleDeclaration } from "./IStyleDeclaration";

export type StyleItem = AtomStyle;

export interface IAtomStyle {
    name: string;
}

export class AtomStyle
    implements IAtomStyle {

    private defaults: { [key: string]: AtomStyle} = {};

    constructor(
        public styleSheet: AtomStyleSheet,
        public readonly parent: AtomStyle,
        public readonly name: string
    ) {
    }

    public getDefaultStyle(forKey: any): AtomStyle {
        return this.defaults[TypeKey.get(forKey)];
    }

    public createNamedStyle<T extends AtomStyle>(c: IClassOf<T>, name: string): T {
        return this[name] = new (c)(this.styleSheet, this, `${this.name}-${name}`);
    }

    public createStyle<TC extends AtomControl, T extends AtomStyle>(tc: IClassOf<TC>, c: IClassOf<T>, name: string): T {

        this.defaults = this.defaults || {};

        const newStyle = new (c)(this.styleSheet, this, `${this.name}-${name}`);
        const key = TypeKey.get(tc);
        this.defaults[key] = newStyle;
        return this[name] = newStyle;
    }

    public toStyle(pairs?: INameValuePairs): INameValuePairs {

        pairs = pairs || {};

        const self = this as any;

        for (const key in self) {
            if (!self.hasOwnProperty(key)) {
                continue;
            }
            if (/^(name|parent|styleSheet|defaults)$/.test(key)) {
                continue;
            }
            const element = self[key];
            // if it is nested style
            const style = element as AtomStyle;
            if (style && style.toStyle) {
                pairs = style.toStyle(pairs);
                continue;
            }

            // if it is class
            const c = element as IStyleDeclaration;
            if (c && typeof c === "object") {
                pairs = this.createStyleText(this.toFullName(key), pairs, c);
                continue;
            }
        }
        return pairs;
    }

    protected toFullName(n: string): string {
        return `${this.name}-${n}`;
    }

    protected init(): void {
        // empty...
    }

    private createStyleText(name: string, pairs: INameValuePairs, styles: IStyleDeclaration): INameValuePairs {
        const sslist: any[] = [];
        for (const key in styles) {
            if (styles.hasOwnProperty(key)) {
                const element = styles[key];
                if (element === undefined || element === null) {
                    continue;
                }
                if (key === "subclasses") {
                    for (const subclassKey in element) {
                        if (element.hasOwnProperty(subclassKey)) {
                            const ve = element[subclassKey];
                            pairs = this.createStyleText(this.toFullName(`${name}${subclassKey}`), pairs, ve);
                        }
                    }
                } else {
                    const keyName = StringHelper.fromCamelToHyphen(key);
                    sslist.push(`${keyName}: ${element}`);
                }
            }
        }
        pairs[name] = `{ ${sslist.join(";\r\n")} }`;
        styles.className = name;
        return pairs;
    }

}
