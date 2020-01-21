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
        return (attributes: any, ... nodes: XNode[] ) => {
            return XNode.create(n,
                attributes
                    ? { ... attributes , for: tag }
                    : { for: tag }, nodes);
        };
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

    public static create(
        // tslint:disable-next-line: ban-types
        name: string | Function,
        attributes: IAttributes,
        ... children: Array<XNode | XNode[] | any>): XNode {
        switch (typeof name) {
            case "object":
                return (name as any).factory(attributes, ... children);
            case "function":
                if (!(name as any).isControl) {
                    return name(attributes, ... children);
                }
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
