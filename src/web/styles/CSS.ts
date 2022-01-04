import { AtomStyleRules } from "../../style/StyleRule";
import { IStyleDeclaration } from "./IStyleDeclaration";

let styleId = 1;

function fromCamelToHyphen(input: string): string {
    return input.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase();
}

function createStyleText(name: string, styles: IStyleDeclaration): string[] {
    const styleList: any[] = [];
    const subclasses = [];
    for (const key in styles) {
        if (styles.hasOwnProperty(key)) {
            if (/^(\_\$\_|className$|toString$)/i.test(key)) {
                continue;
            }
            const element = styles[key];
            if (element === undefined || element === null) {
                continue;
            }
            const keyName = fromCamelToHyphen(key);
            if (key === "subclasses") {
                const n = name;
                for (const subclassKey in element) {
                    if (element.hasOwnProperty(subclassKey)) {
                        const ve = element[subclassKey];
                        subclasses.push( ... createStyleText(`${n}${subclassKey}`, ve));
                    }
                }
            } else {
                if (element.url) {
                    styleList.push(`${keyName}: url(${element})`);
                } else {
                    styleList.push(`${keyName}: ${element}`);
                }
            }
        }
    }
    const cname = fromCamelToHyphen(name);

    const styleClassName = `${cname}`;

    if (styleList.length) {
        return [`${styleClassName} {\r\n${styleList.join(";\r\n")}; }`, ... subclasses];
    }
    return subclasses;
}

/**
 * It will add custom stylesheet to the document and
 * it will create a new unique scope class if selectorName was not provided
 * @param style AtomStyleRules | IStyleDeclaration
 * @param selectorName name of the selector (only use for CustomElement, do not use for components)
 * @returns string
 */
export default function CSS(style: IStyleDeclaration | AtomStyleRules, selectorName?: string): string {
    let styleName = "";
    if (style instanceof AtomStyleRules) {
        styleName = style.name || "";
        if (styleName) {
            styleName = "-" + styleName;
        }
        style = style.style;
    }
    selectorName ??= `.wa-style-${styleId++}${styleName}`;
    const s = document.createElement("style");
    s.id = selectorName;
    const list = createStyleText(selectorName, style);
    s.textContent = list.join("\r\n");
    document.head.appendChild(s);
    return selectorName;
}
