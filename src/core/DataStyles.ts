import StyleRule, { AtomStyleRules } from "../style/StyleRule";
import CSS from "../web/styles/CSS";

const DataStyles = {
    "data-layout": {

        "row": StyleRule()
            .flexLayout({
                alignItems: "center",
                justifyContent: "flex-start"
            })
            .child(StyleRule("*")
                .flex("0 0 auto")
            ),

        "command-row": StyleRule()
            .backgroundColor("var(--accent-bg-color, #808080)")
            .borderRadius(9999)
            .padding(7)
            .nested(StyleRule("button")
                .backgroundColor("var(--accent-color, blue)")
                .color("var(--accent-text-color, white)")
                .hover(StyleRule()
                    .backgroundColor("var(--accent-color, blue)")
                )
                .child(StyleRule("i")
                    .color("var(--accent-text-color, white)")
                )
            ),

        "flex": StyleRule()
            .flexLayout({
                alignItems: "center",
                justifyContent: "flex-start"
            }),

        "flex-frame": StyleRule()
            .flexLayout({
                alignItems: "center",
                justifyContent: "flex-start"
            })
            .borderRadius(7)
            .padding(7)
            .border("solid 1px")
            .borderColor("var(--border-color, lightgray)"),

        "vertical-flex": StyleRule()
            .verticalFlexLayout({
                alignItems: "stretch",
                justifyContent: "flex-start"
            }),

        "vertical-flex-frame": StyleRule()
            .verticalFlexLayout({
                alignItems: "stretch",
                justifyContent: "start" as any
            })
            .borderRadius(7)
            .padding(7)
            .border("solid 1px")
            .borderColor("var(--border-color, lightgray)")
    },
    "data-text-overflow": {
        "ellipsis": StyleRule()
            .minWidth(0)
            .flex("1")
            .overflow("hidden")
            .whiteSpace("nowrap")
            .textOverflow("ellipsis")
    },
    "data-flex-stretch": {
        "full": StyleRule()
            .flex("1 1 100%"),
        "half": StyleRule()
            .flex("1 1 50%"),
        "quarter": StyleRule()
            .flex("1 1 25%"),
        "threeFourth": StyleRule()
            .flex("1 1 75%"),
    }
};

// setup...
for (const key in DataStyles) {
    if (Object.prototype.hasOwnProperty.call(DataStyles, key)) {
        const element = DataStyles[key];
        installStyle(key, element);
    }
}

export type IDataStyles = { [k in keyof typeof DataStyles ]?: keyof (typeof DataStyles)[k] };

export default DataStyles;

function installStyle(dataKey: string, style: any) {
    for (const key in style) {
        if (Object.prototype.hasOwnProperty.call(style, key)) {
            const element = style[key] as AtomStyleRules;
            CSS(element, `*[${dataKey}=${key}]`);
        }
    }
}

