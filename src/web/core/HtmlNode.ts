import XNode from "../../core/XNode";
import { AtomStyleRules } from "../../style/StyleRule";
import Encoder from "./Encoder";
export const encoder = Encoder("entity");

export interface IKeyValuePair {
    [key: string]: string | IKeyValuePair;
}

export function mergeStyles(a: IKeyValuePair): IKeyValuePair {
    const r = {} as IKeyValuePair;
    for (const key in a) {
        if (a.hasOwnProperty(key)) {
            const element = a[key];
            if (element === undefined || element === null) {
                continue;
            }
            if (/^style\-/i.test(key)) {
                const style = r.style || (r.style = "");
                const newStyle = `${key.substr(6)}: ${encoder.htmlEncode(element, false)};`;
                r.style = style ? `${style} ${newStyle}` : newStyle;
                continue;
            }
            if (key === "style") {
                if (r.style) {
                    r.style = `${r.style} ${element}`;
                    continue;
                }
            }
            r[key] = element;
        }
    }
    return r;
}

export function convertToText(node: XNode) {

        if (typeof node.name === "function") {
            node = node.name(
                { ... node.attributes, children: node.children});
            return convertToText(node);
        }

        if (node.name === "br") {
            return "<br/>";
        }
        let attrs: string = "";
        const attributes = mergeStyles(node.attributes);
        const name = node.name;
        const children = node.children;
        for (const key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                const element = attributes[key];
                if (element === null || element === undefined) {
                    continue;
                }
                if (key === "style" && typeof element === "object") {
                    if (element instanceof AtomStyleRules) {
                        attrs += ` ${key}="${encoder.htmlEncode(element.toStyleSheet(), false)}"`;
                        continue;
                    }
                    attrs += ` ${key}="${encoder.htmlEncode(new AtomStyleRules(element).toStyleSheet(), false)}"`;
                    continue;
                }
                attrs += ` ${key}="${encoder.htmlEncode(element, false)}"`;
            }
        }
        const content: string[] = renderChildren(node, children);
        return `<${name}${attrs}>
\t${content.map((s) => s.toString().split("\n").join("\n\t")).join("\r\n")}
</${name}>`;
    }

function renderChildren(node: XNode, children: any[]): string[] {
    if (!children) {
        return [];
    }
    const content: string[] = [];
    if (children) {
        for (const iterator of children) {
            if (!iterator) {
                continue;
            }
            if (Array.isArray(iterator)) {
                for (const child of renderChildren(node, iterator)) {
                    if (child === undefined || child === null) {
                        continue;
                    }
                    content.push(child);
                }
            } else {
                if (typeof iterator !== "string") {
                    content.push(convertToText(iterator));
                    continue;
                }
                content.push(iterator);
            }
        }
    }
    return content;
}

export default class HtmlNode {
    public static convert(node: XNode): string {
        return convertToText(node);
    }
}
