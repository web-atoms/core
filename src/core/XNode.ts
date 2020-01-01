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

    }
}

export default class XNode {

    public static with(n: any, tag: string | any) {
        return class XNodeControl extends n {

            // tslint:disable-next-line: variable-name
            public _creator = n;

            constructor(a: any, t: any) {
                super(a, t || tag);
            }
        };
    }

    public static prepare<T>(n: any): ((attributes: Partial<T>, ... nodes: XNode[]) => XNode) {
        return {
            factory(a: any, ... nodes: any[]) {
                return new XNode(n, a, nodes);
            }
        } as any;
    }

    public static create(
        // tslint:disable-next-line: ban-types
        name: string | Function,
        attributes: IAttributes,
        ... children: Array<XNode | XNode[] | any>): XNode {
        if (typeof name === "object") {
                return (name as any).factory(attributes, ... children);
        }
        return new XNode(name as any, attributes, children);
    }

    constructor(
        // tslint:disable-next-line: ban-types
        public name: string | Function,
        public attributes: IAttributes,
        public children: XNode[] | XNode[][] | any[]) {
    }

    public toString(): string {
        if (this.name) {
            return this.name.toString();
        }
    }
}
