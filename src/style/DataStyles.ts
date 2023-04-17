import { UMD } from "../core/types";

export default function DataStyles() {
    DataStyles.register()
}

DataStyles.register = () => {
    DataStyles.register = () => void 0;

    const path = UMD.resolvePath("@web-atoms/core/src/style/DataStyles.css");
    const link = document.createElement("link");
    link.href = path;
    link.rel = "stylesheet";
    document.head.appendChild(link);
};

declare module "../core/XNode" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IElementAttributes {
        "data-font-weight": "normal" | "bold" | "bolder" | "lighter" ,
        "data-font-style": "italic" | "normal" | "oblique",
        "data-text-align": "left" | "right" | "center" | "justify"
    }
}
