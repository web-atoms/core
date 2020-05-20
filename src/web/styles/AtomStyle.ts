import { App } from "../../App";
import { AtomBinder } from "../../core/AtomBinder";
import { ColorItem } from "../../core/Colors";
import { StringHelper } from "../../core/StringHelper";
import { IClassOf, INameValuePairs } from "../../core/types";
import { TypeKey } from "../../di/TypeKey";
import { AtomStyleSheet } from "./AtomStyleSheet";
import { IStyleDeclaration } from "./IStyleDeclaration";

export type StyleItem = AtomStyle;

const emptyPrototype = Object.getPrototypeOf({});
export interface IAtomStyle {
    name: string;
}

declare var UMD: {
    resolvePath(path: string): string;
};

export class AtomStyle
    implements IAtomStyle {

    private isBuilt: boolean = false;

    constructor(
        public readonly styleSheet: AtomStyleSheet,
        public readonly name: string
    ) {
    }

    public getBaseProperty<T>(tc: IClassOf<T>, name: string): any {
        let c = tc;
        do {
            c = Object.getPrototypeOf(c);
            if (!c) {
                throw new Error("No property descriptor found for " + name);
            }
            const pd = Object.getOwnPropertyDescriptor(c.prototype, name);
            if (!pd) {
                continue;
            }
            return pd.get.apply(this);
        } while (true);
    }

    public toStyle(pairs?: INameValuePairs): INameValuePairs {

        pairs = pairs || {};

        const self = this as any;

        for (const key in self) {
            if (/^(isBuilt|constructor|name|parent|styleSheet|defaults|theme|styleElement)$/.test(key)) {
                continue;
            }
            if (/^\_/.test(key)) {
                continue;
            }
            const element = self[key];
            // if it is nested style
            if (element instanceof AtomStyle) {
                pairs = element.toStyle(pairs);
                continue;
            }

            // if it is class
            const c = element as IStyleDeclaration;
            if (c && typeof c === "object") {
                if (emptyPrototype === Object.getPrototypeOf(c)) {
                    pairs = this.createStyleText(key, pairs, c);
                }
                continue;
            }
        }
        return pairs;
    }

    public build(): void {
        if (this.isBuilt) {
            return;
        }
        this.isBuilt = true;
        const self = this as any;
        for (const key in self) {
            if (/^(isBuilt|constructor|name|parent|styleSheet|defaults|theme|styleElement)$/.test(key)) {
                continue;
            }
            if (/^\_\$\_/.test(key)) {
                continue;
            }
            const element = self[key];
            if (element instanceof AtomStyle) {
                element.build();
                continue;
            }
            const c = element as IStyleDeclaration;
            if (c && typeof c === "object") {
                if (emptyPrototype === Object.getPrototypeOf(c)) {
                    const pv = AtomBinder.getPropertyDescriptor(this, key);
                    if (!pv.get) {
                        continue;
                    }
                    const fullName = this.toFullName(key);
                    const descriptor: PropertyDescriptor = {
                        get() {
                            return {
                                ... pv.get.apply(this),
                                className: fullName,
                                toString: () => fullName
                            };
                        }, configurable: true, enumerable: true
                    };
                    Object.defineProperty(this, key, descriptor);
                }
            }
        }
        this.isBuilt = true;
    }

    public toString(): string {
        const pairs = this.toStyle({});

        const r = [];
        for (const key in pairs) {
            if (pairs.hasOwnProperty(key)) {
                const element = pairs[key];
                // sl.push([key,  element]);
                r.push(`.${key} ${element}`);
            }
        }

        return r.join("\n");
    }

    protected toFullName(n: string): string {
        return `${this.name}-${ StringHelper.fromCamelToHyphen(n)}`;
    }

    private createStyleText(name: string, pairs: INameValuePairs, styles: IStyleDeclaration): INameValuePairs {
        const styleList: any[] = [];
        for (const key in styles) {
            if (styles.hasOwnProperty(key)) {
                if (/^(\_\$\_|className$|toString$)/i.test(key)) {
                    continue;
                }
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
                    if (element.url) {
                        styleList.push(`${keyName}: url(${element})`);
                    } else {
                        styleList.push(`${keyName}: ${element}`);
                    }
                }
            }
        }
        const cname = StringHelper.fromCamelToHyphen(name);

        const styleClassName = `${this.name}-${cname}`;

        if (styleList.length) {
            pairs[styleClassName] = `{ ${styleList.join(";\r\n")}; }`;
        }
        return pairs;
    }

}
