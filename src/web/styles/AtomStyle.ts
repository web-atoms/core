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

export abstract class AtomStyle
    implements IAtomStyle {

    public abstract get root(): IStyleDeclaration;

    private styleText: string = null;

    constructor(
        public readonly styleSheet: AtomStyleSheet,
        public readonly name: string
    ) {
        this.name = this.name + "-root";
    }

    public getBaseProperty<T>(tc: IClassOf<T>, name: keyof this): any {
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

    public build(): void {
        if (this.styleText) {
            return;
        }
        this.styleText = this.createStyleText("", [], this.root).join("\n");
    }

    public toString(): string {
        return this.styleText;
    }

    private createStyleText(name: string, pairs: string[], styles: IStyleDeclaration): string[] {
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
                    const n = name;
                    for (const subclassKey in element) {
                        if (element.hasOwnProperty(subclassKey)) {
                            const ve = element[subclassKey];
                            pairs = this.createStyleText(`${n}${subclassKey}`, pairs, ve);
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

        const styleClassName = `${this.name}${cname}`;

        if (styleList.length) {
            pairs.push(`.${styleClassName} { ${styleList.join(";\r\n")}; }`);
        }
        return pairs;
    }

}
