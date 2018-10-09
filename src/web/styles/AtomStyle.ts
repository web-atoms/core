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

    private isBuilt: boolean = false;

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
        const style = this[name] = new (c)(this.styleSheet, this, `${this.name}-${name}`);
        style.build();
        return style;
    }

    public createStyle<TC extends AtomControl, T extends AtomStyle>(tc: IClassOf<TC>, c: IClassOf<T>, name: string): T {

        this.defaults = this.defaults || {};

        const newStyle = new (c)(this.styleSheet, this, `${this.name}-${name}`);
        const key = TypeKey.get(tc);
        this.defaults[key] = newStyle;
        newStyle.build();
        return this[name] = newStyle;
    }

    public getBaseProperty<T>(tc: IClassOf<T>, name: string): any {
        const c = Object.getPrototypeOf(tc);
        const b = Object.getPrototypeOf(c);
        const pd = Object.getOwnPropertyDescriptor(b, name);
        return pd.get.apply(this);
    }

    public toStyle(pairs?: INameValuePairs): INameValuePairs {

        pairs = pairs || {};

        const self = this as any;

        for (const key in self) {
            if (/^(isBuilt|constructor|name|parent|styleSheet|defaults|theme)$/.test(key)) {
                continue;
            }
            if (/^\_/.test(key)) {
                continue;
            }
            const element = self[key];
            if (typeof element === "function") {
                continue;
            }
            // if it is nested style
            const style = element as AtomStyle;
            if (style && style.toStyle) {
                pairs = style.toStyle(pairs);
                continue;
            }

            // if it is class
            const c = element as IStyleDeclaration;
            if (c && typeof c === "object") {
                pairs = this.createStyleText(key, pairs, c);
                continue;
            }
        }
        return pairs;
    }

    protected toFullName(n: string): string {
        return `${this.name}-${ StringHelper.fromCamelToHyphen(n)}`;
    }

    protected build(): void {
        if (this.isBuilt) {
            return;
        }
        this.isBuilt = true;
        this.styleSheet.pushUpdate();
        const self = this as any;
        for (const key in self) {
            if (/^(isBuilt|constructor|name|parent|styleSheet|defaults|theme)$/.test(key)) {
                continue;
            }
            if (/^\_\$\_/.test(key)) {
                continue;
            }
            const element = self[key];
            if (typeof element === "function") {
                continue;
            }
            if (element instanceof AtomStyle) {
                const ec = element as AtomStyle;
                ec.build();
                continue;
            }
            if (typeof element === "object") {
                const descriptor: PropertyDescriptor = {
                    get() {
                        return {
                            ... element,
                            className: this.toFullName(key)
                        };
                    }, configurable: true, enumerable: true
                };
                Object.defineProperty(this, key, descriptor);
            }
        }
        this.isBuilt = true;
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
                const keyName = StringHelper.fromCamelToHyphen(key);
                if (key === "subclasses") {
                    for (const subclassKey in element) {
                        if (element.hasOwnProperty(subclassKey)) {
                            const ve = element[subclassKey];
                            pairs = this.createStyleText(`${name}${subclassKey}`, pairs, ve);
                        }
                    }
                } else {
                    sslist.push(`${keyName}: ${element}`);
                }
            }
        }
        const cname = StringHelper.fromCamelToHyphen(name);

        pairs[`${this.name}-${cname}`] = `{ ${sslist.join(";\r\n")} }`;
        styles.className = name;
        return pairs;
    }

}
