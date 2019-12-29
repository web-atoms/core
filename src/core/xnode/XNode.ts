export interface IAttributes {
    [key: string]: string | number | null | any;
}

// tslint:disable-next-line: no-namespace
declare namespace JSX {

    // tslint:disable-next-line: interface-name
    interface ElementAttributesProperty {
        vsProps;
    }

}

export default class XNode {

    public static prepare<T>(n: any): ((attributes: Partial<T>, ... nodes: XNode[]) => XNode) {
        return n;
        // return (attributes: Partial<T>, ... nodes: XNode[]) => {
        //     if (typeof n === "string") {
        //         return new XNode(n, attributes as any, nodes);
        //     }
        //     return new XNode(n, attributes as any, nodes);
        // };
    }

    public static create(
        // tslint:disable-next-line: ban-types
        name: string | Function,
        attributes: IAttributes,
        ... children: Array<XNode | XNode[] | any>): XNode {
        // if (typeof name === "function") {
        //     if (children) {
        //         attributes = attributes || {};
        //         // (attributes as any).children = children;
        //     }
        //     return (name as any)(attributes, children);
        // }
        return new XNode(name, attributes, children);
    }

    constructor(
        // tslint:disable-next-line: ban-types
        public name: string | Function,
        public attributes: IAttributes,
        public children: XNode[] | XNode[][] | any[]) {
        const first = this.children ? this.children[0] : null;
        if (first && Array.isArray(first)) {
            // flatten..
            const a = this.children;
            const copy = [];
            for (const iterator of a) {
                for (const child of iterator) {
                    copy.push(child);
                }
            }
            this.children = copy;
        }
    }
    public toString(): string {
        if (this.name) {
            return this.name.toString();
        }
    }
}
