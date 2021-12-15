import Colors from "../../core/Colors";
import StyleRule, { AtomStyleRules } from "../../style/StyleRule";
import CSS from "./CSS";

import Colors from "@web-atoms/core/dist/core/Colors";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

export function combine(... names: any[]) {
    const r = [];
    for (const iterator of names) {
        if (!iterator) {
            continue;
        }
        const v = iterator.toString();
        if (!v) {
            continue;
        }
        r.push(v);
    }
    return r.join(" ");
}

function CSSToString(s) {
    const name = CSS(s);
    return () => name;
}

const CommonStyles = {
    combine,
    color: {
        yellow: CSS(StyleRule()
            .color(Colors.yellow)),
        green: CSS(StyleRule()
            .color(Colors.green)),
        red: CSS(StyleRule()
            .color(Colors.red)),
    },
    backgroundColor: {
        yellow: CSS(StyleRule()
            .backgroundColor(Colors.yellow)),
        green: CSS(StyleRule()
            .backgroundColor(Colors.green)),
        red: CSS(StyleRule()
            .backgroundColor(Colors.red)),
    },
    bold: CSS(StyleRule().fontWeight("bold")),
    margin5: CSS(StyleRule().margin(5)),
    padding5: CSS(StyleRule().padding(5)),
    borderRadius9999: CSS(StyleRule().borderRadius(9999)),
    borderRadius5: CSS(StyleRule().borderRadius(5)),
    italic: CSS(StyleRule().fontStyle("italic")),
    overflow: {
        auto: CSS(StyleRule().overflow("auto")),
        hidden: CSS(StyleRule().overflow("hidden"))
    },
    flex: {
        inline: CSS(StyleRule().display("inline-flex")),
        stretch: CSS(StyleRule().flexStretch()),
        alignItemsCenter: CSS(StyleRule().alignItems("center")),
        horizontal: CSS(StyleRule().flexDirection("row")),
        vertical: CSS(StyleRule().flexDirection("column")),
        justifyContentSpaceAround: CSS(StyleRule().justifyContent("space-around")),
        toString: CSSToString(StyleRule().display("flex"))
    },
};

export default CommonStyles;
