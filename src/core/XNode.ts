import type { ObjectPositionType } from "../style/StyleRule";
import type { AtomControl } from "../web/controls/AtomControl";
import Bind, { bindSymbol } from "./Bind";
import type { ColorItem } from "./Colors";
import { IClassOf, IDisposable } from "./types";

export interface IAttributes {
    [key: string]: string | number | null | any;
}

declare var bridge: any;

export class RootObject {

    public get vsProps(): {
        [k in keyof this]?: this[k] | Bind
    } | { [k: string]: any } | {} {
        return undefined;
    }

    public addEventListener(name: string, handler: EventListenerOrEventListenerObject): IDisposable {
        return bridge.addEventHandler(this, name, handler);
    }

    public appendChild(e: any) {
        bridge.appendChild(this, e);
    }

    public dispatchEvent(evt: Event) {
        bridge.dispatchEvent(evt);
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
                eventKeydown?: any;
                eventKeyup?: any;
                eventKeypress?: any;
                text?: string | any;
                [key: string]: any;
                "event-click"?: (e: MouseEvent) => void;
                "event-blur"?: (e: Event) => void;
                "event-focus"?: (e: Event) => void;
                "on-create": (ctrl: AtomControl, element: HTMLElement) => void;
                /**
                 * If display is set to true, it will be set as empty string,
                 * which will unset the value and it will inherit the style from stylesheet.
                 * If it is set to false, it will be set to "none"
                 */
                "style-display"?: boolean | string;

                /** number will be converted to pixels */
                "style-left"?: number | string;
                /** number will be converted to pixels */
                "style-top"?: number | string;
                /** number will be converted to pixels */
                "style-bottom"?: number | string;
                /** number will be converted to pixels */
                "style-right"?: number | string;
                /** number will be converted to pixels */
                "style-width"?: number | string;
                /** number will be converted to pixels */
                "style-height"?: number | string;
                /** number will be converted to pixels */
                "style-position"?: ObjectPositionType;
                /** number will be converted to pixels */
                "style-font-size"?: number | string;
                "style-font-family"?: string;
                "style-font-weight"?: string;
                "style-border"?: string;
                "style-border-width"?: string;
                "style-border-color"?: string | ColorItem;
                "style-color"?: string | ColorItem;
                "style-background-color"?: string | ColorItem;

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

export const xnodeSymbol = Symbol("XNode");

export const isControl = Symbol("isControl");

export const elementFactorySymbol = Symbol("elementFactory");

export const isFactorySymbol = Symbol("isFactory");

export const attachedSymbol = Symbol("attached");

export const isTemplateSymbol = Symbol("isTemplate");

export const constructorNeedsArgumentsSymbol = Symbol("constructorNeedsArguments");

export const attachedProperties: { [key: string]: (e, v) => void } = {};

let attachedId = 1;

const attach = (name, attacher) => {
    const key = `:${attachedId++}`;
    const fx = (v) => {
        return {
            [key]: v
        };
    };
    attachedProperties[key] = attacher;
    fx[attachedSymbol] = attacher;
    fx[isFactorySymbol] = key;
    return fx;
};

export default class XNode {

    public static isFactory = isFactorySymbol;

    public static elementFactory = elementFactorySymbol;

    public static bindSymbol = bindSymbol;

    public static isTemplate = isTemplateSymbol;

    public static prepareAttached = attach;

    public static constructorNeedsArguments = constructorNeedsArgumentsSymbol;

    public static classes: {[key: string]: any } = {};

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
        function px(v) {
            return ({
                [n]: v
            });
        }
        px.factory = (a: any, ... nodes: any[]) => {
            return new XNode(n, a, nodes, isProperty, isTemplate);
        };
        px.toString = () => n;
        return px as any;
        // return {
        //     factory(a: any, ... nodes: any[]) {
        //         return new XNode(n, a, nodes, isProperty , isTemplate);
        //     },
        //     toString() {
        //         return n;
        //     }
        // } as any;
    }

    // public static template(): NodeFactory {
    //     return {
    //         factory: true,
    //         isTemplate: true,
    //     } as any;
    // }

    // public static attached = (name: string): AttachedNode => (n) => ({ [name]: n });

    // public static property(): NodeFactory {
    //     return {
    //         factory: true
    //     } as any;
    // }

    public static getClass(fullTypeName: string, assemblyName: string) {
        const n = fullTypeName + ";" + assemblyName;
        const cx = XNode.classes[n] || (XNode.classes[n] =
            bridge.getClass(
                fullTypeName,
                assemblyName,
                RootObject,
                (name, isProperty, isTemplate) =>
                    (a?: any, ... nodes: any[]) => new XNode(name, a, nodes, isProperty, isTemplate )));
        return cx;
    }

    public static factory = (name, isProperty, isTemplate) => (a?: any, ... nodes: any[]) => {
        return new XNode(name, a, nodes, isProperty, isTemplate);
    }

    /**
     * Declares Root Namespace and Assembly. You can use return function to
     * to declare the type
     * @param ns Root Namespace
     */
    public static namespace(ns: string, assemblyName: string) {
        return (type: string, isTemplate?: boolean) => {
            return (c) => {
                // static properties !!
                for (const key in c) {
                    if (c.hasOwnProperty(key)) {
                        const element = c[key];
                        if (element) {
                            const n = ns + "." + type + ":" + key + ";" + assemblyName;
                            const af: any = (a) => {
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
                            af.factory = (a?: any, ... nodes: any[]) =>
                                new XNode(n, a, nodes, true, element.isTemplate );
                            af.toString = () => n;
                            c[key] = af;
                        }
                    }
                }
                const tn = ns + "." + type + ";" + assemblyName;
                c.factory = (a?: any, ... nodes: XNode[]) => {
                    return new XNode(tn, a, nodes, false, isTemplate);
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

        if (typeof name === "string") {
            return new XNode(name, attributes, children);
        }
        if ((name as any)[isFactorySymbol]) {
            return new XNode(name as any, attributes, children);
        }
        if ((name as any).factory) {
            return ((name as any).factory)(attributes, ... children);
        }
        switch (typeof name) {
            case "object":
                name = (name as any).toString();
                break;
            case "function":
                return name(attributes || {}, ... children);
        }
        return new XNode(name as any, attributes, children);
    }

    public nameArgs: any;

    constructor(
        // tslint:disable-next-line: ban-types
        public name: string | Function,
        public attributes: IAttributes,
        public children: XNode[] | XNode[][] | any[],
        public isProperty?: boolean,
        public isTemplate?: boolean) {
        this[xnodeSymbol] = true;
    }

    public toString(): string {
        if (typeof this.name === "string") {
            return `name is of type string and value is ${this.name}`;
        }
        return `name is of type ${typeof this.name}`;
    }
}

if (typeof bridge !== "undefined") {
    bridge.XNode = XNode;
}
