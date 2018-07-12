import { KeyValuePairs } from "../../core/KeyValuePairs";
import { StringHelper } from "../../core/StringHelper";
import { ArrayHelper, INameValuePairs, INotifyPropertyChanged } from "../../core/types";
import { AtomStyle, IAtomStyle } from "./AtomStyle";
import { AtomStyleSheet } from "./AtomStyleSheet";
import { IStyleDeclaration } from "./IStyleDeclaration";

export interface IStyleSubClass {
    name: string;
    styles: INameValuePairs;
}

export class AtomStyleClass
    implements INotifyPropertyChanged,
    IAtomStyle {

    private styles: INameValuePairs = {};

    private subClasses: IStyleSubClass[] = [];

    private mCached: string;

    public get name(): string {
        return this.className;
    }

    constructor(
        public readonly styleSheet: AtomStyleSheet,
        public readonly parent: AtomStyle,
        public readonly className: string,
        props?: INameValuePairs ) {
        if (props) {
            this.updateStyle(props);
        }
    }

    public subClass(name: string, styles: IStyleDeclaration): AtomStyleClass {
        ArrayHelper.remove(this.subClasses, (s) => s.name === name);
        this.subClasses.push({
            name,
            styles
        });
        return this;
    }

    public clone(name: string, pairs?: IStyleDeclaration): AtomStyleClass {
        const clone = this.parent.createClass(name, this.styles).updateStyle(pairs);
        for (const iterator of this.subClasses) {
            // we need clone....
            const sc = {};
            for (const key in iterator.styles) {
                if (iterator.styles.hasOwnProperty(key)) {
                    const element = iterator.styles[key];
                    sc[key] = element;
                }
            }
            clone.subClass(iterator.name, sc);
        }
        return clone;
    }

    public clear(): AtomStyleClass {
        this.styles = {};
        this.subClasses.length = 0;
        this.styleSheet.pushUpdate();
        return this;
    }

    public updateStyle(props?: IStyleDeclaration): AtomStyleClass {
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                const element = props[key];
                this.styles[key] = element;
            }
        }
        this.styleSheet.pushUpdate();
        return this;
    }

    public updateSubClass(name: string, props: IStyleDeclaration): AtomStyleClass {
        const sc = this.subClasses.find( (s) => s.name === name);
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                const element = props[key];
                sc.styles[key] = element;
            }
        }
        this.styleSheet.pushUpdate();
        return this;
    }

    public createStyle(): KeyValuePairs {

        const result: KeyValuePairs = [];
        result.push({ key: this.className, value: this.createStyleText(this.styles) });

        for (const iterator of this.subClasses) {
            result.push({ key: `${this.className}${iterator.name}`, value: this.createStyleText(iterator.styles) });
        }
        return result;
    }

    public onPropertyChanged(name: string): void {
        this.styleSheet.pushUpdate();
    }

    private createStyleText(styles: INameValuePairs): string {
        const sslist: any[] = [];
        for (const key in styles) {
            if (styles.hasOwnProperty(key)) {
                const element = styles[key];
                if (element === undefined || element === null) {
                    continue;
                }
                const keyName = StringHelper.fromCamelToHyphen(key);
                sslist.push(`${keyName}: ${element}`);
            }
        }
        return `{ ${sslist.join(";\r\n")} }`;
    }
}
