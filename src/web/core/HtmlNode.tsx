import XNode, { elementFactorySymbol } from "../../core/XNode.js";
import { AtomStyleRules } from "../../style/StyleRule.js";
import { ElementValueSetters } from "../controls/AtomControl.js";
import { AtomUI, descendentElementIterator } from "./AtomUI.js";
import Encoder from "./Encoder.js";
export const encoder = Encoder("entity");

export interface IKeyValuePair {
    [key: string]: string | IKeyValuePair;
}

const fromHyphenToCamel = (input: string) => input.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

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
                const newStyle = `${key.substring(6)}: ${encoder.htmlEncode(element, false)};`;
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
        let textContent = "";
        for (const key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                const element = attributes[key];
                if (element === null || element === undefined) {
                    continue;
                }
                if (key === "text") {
                    textContent = element.toString();
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
        return `<${name}${attrs}>${textContent}
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

const setters = ElementValueSetters;

function render(node: XNode, root: HTMLElement): void {
    const a = node.attributes;
    if (a) {
        for (const key in a) {
            if (Object.prototype.hasOwnProperty.call(a, key)) {
                let element = a[key];
                const setter = setters[key];
                if (setter !== void 0) {
                    setter(null, root, element);
                    continue;
                }
                if (key.length > 5 && /^style/.test(key)) {
                    // root.style[fromHyphenToCamel(key.substring(6))] = element;
                    if (/^style\-/.test(key)) {
                        root.style.setProperty(key.substring(6), element);
                    } else {
                        root.style[fromHyphenToCamel(key.substring(6))] = element;
                    }
                    continue;
                }
                if (/^data-/i.test(key)) {
                    if (typeof element === "object") {
                        element = JSON.stringify(element);
                    }
                    root.dataset[fromHyphenToCamel(key.substring(5))] = element;
                    continue;
                }
                root[key] = element;
            }
        }
    }
    const children = node.children;
    if (!children) {
        return;
    }
    for (const iterator of children) {
        if (!iterator) {
            continue;
        }
        if (typeof iterator === "string") {
            root.appendChild(document.createTextNode(iterator));
            continue;
        }
        const name = iterator.name;
        const child = document.createElement(name);
        render(iterator, child);
        root.appendChild(child);
    }
}

export default class HtmlNode {
    public static render = render;

    public static convert(node: XNode): string {
        return convertToText(node);
    }

    public static toElement(node: XNode, sanitize: boolean = true): HTMLElement {
        const div = document.createElement("div");
        render(<div>{ node }</div>, div);
        if (sanitize) {
            for(const e of descendentElementIterator(div)) {
                if (/^script$/i.test(e.nodeName)) {
                    e.remove();
                    continue;
                }
                // remove all on attributes...
            }
        }
        return div.firstElementChild as HTMLElement;
    }

}
