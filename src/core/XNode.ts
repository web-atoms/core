import Bind from "./Bind";
import { IClassOf } from "./types";

export interface IAttributes {
    [key: string]: string | number | null | any;
}

export class RootObject {
    public get vsProps(): {
        [k in keyof this]?: this[k] | Bind
    } | { [k: string]: any } | {} {
        return undefined;
    }
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

export type NodeFactory = (a?: any, ... nodes: XNode[]) => XNode;

export type AttachedNode = (n: any) => { [key: string]: any};

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

    public static template(): NodeFactory {
        return {
            factory: true,
            isTemplate: true,
        } as any;
    }

    public static attached<T>(): AttachedNode {
        return {
            factory: true,
            attached: true
        } as any;
    }

    /**
     * Declares Root Namespace and Assembly. You can use return function to
     * to declare the type
     * @param ns Root Namespace
     */
    public static namespace(ns: string, assemblyName: string) {
        return (type: any) => {
            return (c) => {
                for (const key in type) {
                    if (type.hasOwnProperty(key)) {
                        const element = type[key];
                        if (element) {
                            const n = ns + "." + type + ":" + key + ";" + assemblyName;
                            if (element.factory) {
                                type[key] = {
                                    factory(a?: any, ... nodes: XNode[]) {
                                        return new XNode(n, a, nodes, true, element.isTemplate);
                                    },
                                    toString() {
                                        return n;
                                    }
                                };
                            } else if (element.attached) {
                                type[key] = (a) => {
                                    const r = {
                                        [n]: a
                                    };
                                    Object.defineProperty(r, "toString", {
                                        value: () => n,
                                        enumerable: false,
                                        configurable: false
                                    });
                                    return r;
                                };
                            }
                        }
                    }
                }
                const tn = ns + "." + type + ";" + assemblyName;
                c.factory = (a?: any, ... nodes: XNode[]) => {
                    return new XNode(tn, a, nodes);
                };
                c.toString = () => tn;
            };
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
