import { KeyValuePairs } from "../../core/KeyValuePairs";
import { StringHelper } from "../../core/StringHelper";
import { ArrayHelper, INameValuePairs, INotifyPropertyChanged } from "../../core/types";
import { AtomStyle, IAtomStyle } from "./AtomStyle";
import { AtomStyleSheet } from "./AtomStyleSheet";
import { IStyleDeclaration } from "./IStyleDeclaration";
import { IStyleDeclarationFunc } from "./IStyleDeclarationFunc";

// export interface IStyleSubClass {
//     name: string;
//     styles: INameValuePairs;
// }

export function StyleClass(name: string): (target: AtomStyle, propertyKey: string, descriptor: any) => any {
    return (target: AtomStyle, propertyKey: string, descriptor: any) => {
        // tslint:disable-next-line:ban-types
        const original = descriptor.get as Function;
        // tslint:disable-next-line:only-arrow-functions
        descriptor.get = function()  {
            return this.createClass(name, original.call(this));
        };
        Object.defineProperty(target, propertyKey, descriptor);
    };
}

export class AtomStyleClass
    implements INotifyPropertyChanged,
    IAtomStyle {

    // private styles: INameValuePairs = {};

    // private subClasses: IStyleSubClass[] = [];

    private subClasses: AtomStyleClass[] = [];

    private mCached: string;

    public get name(): string {
        return this.className;
    }

    constructor(
        public readonly styleSheet: AtomStyleSheet,
        public readonly parent: AtomStyle,
        public readonly className: string,
        public props: IStyleDeclarationFunc ) {
    }

    public subClass(name: string, styles: IStyleDeclarationFunc): AtomStyleClass {
        const n = this.className + name;
        ArrayHelper.remove(this.subClasses, (s) => s.name === n);
        const sc = new AtomStyleClass(this.styleSheet, this.parent, n, styles);
        this.subClasses.push(sc);
        return sc;
    }

    /**
     * Creates hover class
     * @param styles
     */
    public hover(styles: IStyleDeclarationFunc): AtomStyleClass;
    /**
     * Creates hover class for given class
     * @param child
     * @param styles
     */
    public hover(child: string, styles: IStyleDeclarationFunc): AtomStyleClass;
    public hover(childOrStyle: string | IStyleDeclarationFunc, styles?: IStyleDeclarationFunc): AtomStyleClass {
        return this.createSubClass(":hover", childOrStyle, styles);
    }

    public firstChild(styles: IStyleDeclarationFunc): AtomStyleClass;
    public firstChild(child: string, styles: IStyleDeclarationFunc): AtomStyleClass;
    public firstChild(childOrStyle: string | IStyleDeclarationFunc, styles?: IStyleDeclarationFunc): AtomStyleClass {
        return this.createSubClass(":first-child", childOrStyle, styles);
    }

    public lastChild(styles: IStyleDeclarationFunc): AtomStyleClass;
    public lastChild(child: string, styles: IStyleDeclarationFunc): AtomStyleClass;
    public lastChild(childOrStyle: string | IStyleDeclarationFunc, styles?: IStyleDeclarationFunc): AtomStyleClass {
        return this.createSubClass(":last-child", childOrStyle, styles);
    }

    public immediateChild(styles: IStyleDeclarationFunc): AtomStyleClass;
    public immediateChild(name: string, styles: IStyleDeclarationFunc): AtomStyleClass;
    public immediateChild(
        nameOrStyles: string | IStyleDeclarationFunc,
        styles?: IStyleDeclarationFunc): AtomStyleClass {
        if (typeof nameOrStyles === "string") {
            return this.subClass(` > ${nameOrStyles}`, styles);
        }
        return this.subClass(" > *", nameOrStyles);
    }

    public descendent(styles: IStyleDeclarationFunc): AtomStyleClass;
    public descendent(name: string, styles: IStyleDeclarationFunc): AtomStyleClass;
    public descendent(
        nameOrStyles: string | IStyleDeclarationFunc,
        styles?: IStyleDeclarationFunc): AtomStyleClass {
        if (typeof nameOrStyles === "string") {
            return this.subClass(` ${nameOrStyles}`, styles);
        }
        return this.subClass(" *", nameOrStyles);
    }

    public clone(name: string, pairs?: IStyleDeclarationFunc): AtomStyleClass {
        const clone = this.parent.createClass(name, this.props).updateStyle(pairs);
        // for (const iterator of this.subClasses) {
        //     // we need clone....
        //     const sc = {};
        //     for (const key in iterator.styles) {
        //         if (iterator.styles.hasOwnProperty(key)) {
        //             const element = iterator.styles[key];
        //             sc[key] = element;
        //         }
        //     }
        //     clone.subClass(iterator.name, sc);
        // }
        return clone;
    }

    public clear(): AtomStyleClass {
        this.props = () => ({});
        this.subClasses.length = 0;
        this.styleSheet.pushUpdate();
        return this;
    }

    public updateStyle(props?: IStyleDeclarationFunc): AtomStyleClass {
        // for (const key in props) {
        //     if (props.hasOwnProperty(key)) {
        //         const element = props[key];
        //         this.styles[key] = element;
        //     }
        // }
        const old = this.props;
        this.props = () => {
            const v = old();
            const n = props();
            for (const key in n) {
                if (n.hasOwnProperty(key)) {
                    const element = n[key];
                    if (typeof element === "object") {
                        this.subClass(key, () => element);
                    } else {
                    v[key] = element;
                    }
                }
            }
            return v;
        };
        this.styleSheet.pushUpdate();
        return this;
    }

    // public updateSubClass(name: string, props: IStyleDeclarationFunc): AtomStyleClass {
    //     const sc = this.subClasses.find( (s) => s.name === name);
    //     sc.updateStyle(props);
    //     // for (const key in props) {
    //     //     if (props.hasOwnProperty(key)) {
    //     //         const element = props[key];
    //     //         sc.styles[key] = element;
    //     //     }
    //     // }
    //     this.styleSheet.pushUpdate();
    //     return this;
    // }

    // public createStyle(): KeyValuePairs {

    //     const result: KeyValuePairs = [];
    //     result.push({ key: this.className, value: this.createStyleText(this.props) });

    //     for (const iterator of this.subClasses) {
    //         result.push({ key: `${this.className}${iterator.name}`, value: this.createStyleText(iterator.props) });
    //     }
    //     return result;
    // }

    public toStyle(pairs: INameValuePairs): any {
        pairs = pairs || {};
        this.createStyleText(pairs);
        for (const iterator of this.subClasses) {
            iterator.toStyle(pairs);
        }
        return pairs;
    }

    public onPropertyChanged(name: string): void {
        this.styleSheet.pushUpdate();
    }

    private createStyleText(pairs: INameValuePairs): INameValuePairs {
        const sslist: any[] = [];
        const styles = this.props();
        for (const key in styles) {
            if (styles.hasOwnProperty(key)) {
                const element = styles[key];
                if (element === undefined || element === null) {
                    continue;
                }
                if (typeof element === "object") {
                    this.subClass(key, () => element);
                } else {
                    const keyName = StringHelper.fromCamelToHyphen(key);
                    sslist.push(`${keyName}: ${element}`);
                }
            }
        }
        pairs[this.className] = `{ ${sslist.join(";\r\n")} }`;
        return pairs;
    }

    private createSubClass(
        postFix: string,
        childOrStyle: string | IStyleDeclarationFunc,
        styles?: IStyleDeclarationFunc): AtomStyleClass {
        if (typeof childOrStyle === "string") {
            return this.subClass(`${childOrStyle}${postFix}`, styles);
        }
        return this.subClass(postFix, childOrStyle);
    }
}
