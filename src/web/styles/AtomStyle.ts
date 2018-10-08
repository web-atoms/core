import { StringHelper } from "../../core/StringHelper";
import { INameValuePairs } from "../../core/types";
import { TypeKey } from "../../di/TypeKey";
import { AtomStyleSheet } from "./AtomStyleSheet";
import { IStyleDeclaration } from "./IStyleDeclaration";

export type StyleItem = AtomStyle;

export interface IAtomStyle {
    name: string;
}

export class AtomStyle
    implements IAtomStyle {

    private defaults: { [key: string]: AtomStyle} = {};

    // tslint:disable-next-line:ban-types
    [key: string]: any;

    constructor(
        public styleSheet: AtomStyleSheet,
        public readonly parent: AtomStyle,
        public readonly name: string
    ) {
    }

    public getDefaultStyle(forKey: any): AtomStyle {
        return this.defaults[TypeKey.get(forKey)];
    }

    public toStyle(pairs?: INameValuePairs): INameValuePairs {

        pairs = pairs || {};

        for (const key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            const element = this[key];
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
