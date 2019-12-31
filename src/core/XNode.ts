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
        function fx(attrs, ... nodes: any[]) {
            return new XNode(n, attrs, nodes);
        }
        fx.xNode = true;
        return fx as any;
    }

    public static create(
        // tslint:disable-next-line: ban-types
        name: string | Function,
        attributes: IAttributes,
        ... children: Array<XNode | XNode[] | any>): XNode {
        switch (typeof name) {
            case "function":
                if ((name as any).xNode) {
                    return (name).apply(null, children);
                }
            case "string":
            default:
                return new XNode(name, attributes, children);
        }
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
