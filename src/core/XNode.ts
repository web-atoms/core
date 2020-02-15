import { IClassOf } from "./types";

export interface IAttributes {
    [key: string]: string | number | null | any;
}

// tslint:disable-next-line: no-namespace
declare global {

    namespace JSX {

        // tslint:disable-next-line: interface-name
        interface ElementAttributesProperty {
            vsProps;
        }

        type HtmlPartial<T> = {
            [k in keyof T]?: {
                [tx in keyof T[k]]?: T[k][tx] | any;
            } | {
                eventClick?: any;
                eventBlur?: any;
                eventFocus?: any;
                text?: string | any;
                [key: string]: any
            }
        };

        type IAllHtmlElements = HtmlPartial<HTMLElementTagNameMap>;

        // tslint:disable-next-line
        interface IntrinsicElements extends IAllHtmlElements {

        }
    }
}

export type IMergedControl<T, T1> =
{
    [P in keyof (T & T1)]?: (T & T1)[P];
} & {
    vsProps: {
        [P in keyof (T & T1)]?: (T & T1)[P];
    }
};

export default class XNode {

    public static attach<T, T1 extends HTMLElementTagNameMap, K extends keyof T1>(
        n: IClassOf<T>,
        tag: K): new (... a: any[]) => IMergedControl<T, T1[K]> ;
    public static attach<T, T1>(
        n: IClassOf<T>,
        tag: (a?: Partial<T1>, ... nodes: XNode[]) => XNode): new (... a: any[]) => IMergedControl<T, T1> ;
    public static attach(
        n: any,
        tag: any): any {
        return {
            factory: (attributes: any, ... nodes: XNode[] ) => new XNode(n, attributes
                ? { ... attributes, for: tag }
                : { for: tag}, nodes)
        };
    }

    /**
     * Creates a class for Native Elements, e.g Xamarin.Forms classes
     * @param name name of Property/class
     * @param ctor Class to inspect properties
     * @param isProperty true if this is a property
     * @param isTemplate true if this is a template
     */
    public static createNative<T, C = (new () => T)>(
        name: string,
        ctor: C,
        isProperty?: boolean,
        isTemplate?: boolean):
        C & {
            [K in keyof C]: C[K];
        } {
        const aa = ctor as any;
        aa.factory = (a?: any, ... nodes: XNode[]) => {
            return new XNode(name, { ... a }, nodes, isProperty, isTemplate);
        };
        aa.toString = () => {
            return name;
        };
        return aa;
    }

    public static prepare<T>(
        n: any,
        isProperty?: boolean,
        isTemplate?: boolean): ((attributes: Partial<T>, ... nodes: XNode[]) => XNode) {
        return {
            factory(a: any, ... nodes: any[]) {
                return new XNode(n, a, nodes, isProperty , isTemplate);
            },
            toString() {
                return n;
            }
        } as any;
    }

    /** Creates Attached Property for Xamarin.Forms */
    public static attached(n: string) {
        return (v) => {
            const a = {
                [n]: v
            };
            Object.defineProperty(a, "toString", {
                value: () => n,
                enumerable: false
            } );
            return a;
        };
    }

    public static create(
        // tslint:disable-next-line: ban-types
        name: string | Function,
        attributes: IAttributes,
        ... children: Array<XNode | XNode[] | any>): XNode {
        if ((name as any).factory) {
            return ((name as any).factory)(attributes, ... children);
        }
        if ((name as any).isControl) {
            return new XNode(name as any, attributes, children);
        }
        if (typeof name === "object") {
            name = (name as any).toString();
        }
        return new XNode(name as any, attributes, children);
    }

    constructor(
        // tslint:disable-next-line: ban-types
        public name: string | Function,
        public attributes: IAttributes,
        public children: XNode[] | XNode[][] | any[],
        public isProperty?: boolean,
        public isTemplate?: boolean) {
    }

    public toString(): string {
        if (typeof this.name === "string") {
            return `name is of type string and value is ${this.name}`;
        }
        return `name is of type ${typeof this.name}`;
    }
}
