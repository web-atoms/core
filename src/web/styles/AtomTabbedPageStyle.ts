import { BindableProperty } from "../../core/BindableProperty";
import { ModuleFiles } from "../../ModuleFiles";
import { AtomStyle } from "./AtomStyle";
import { AtomStyleClass } from "./AtomStyleClass";
import { AtomTheme } from "./AtomTheme";

export class AtomTabbedPageStyle extends AtomStyle {

    @BindableProperty
    public padding: number;

    public get theme(): AtomTheme {
        return this.styleSheet as AtomTheme;
    }

    public readonly tabItem: AtomStyleClass = this.createClass("tab-item", {
        display: "inline-block",
        borderTopLeftRadius: (this.padding || this.theme.padding) + "px",
        borderTopRightRadius: (this.padding || this.theme.padding) + "px",
        marginLeft: "2px",
        padding: 0,
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "lightgray",
        backgroundColor: this.theme.bgColor,
        minWidth: "90px",
        minHeight: "30px",
        cursor: "default",
        position: "relative"
    })
    .subClass(" > div", {
        display: "inline-block",
        position: "absolute",
        left: (this.padding || this.theme.padding) + "px",
        top: (this.padding || this.theme.padding) + "px",
        bottom: (this.padding || this.theme.padding) + "px",
        right: "22px"
    })
    .subClass(":hover", {
        backgroundColor: this.theme.hoverColor
    });

    public readonly selectedTabItem = this.tabItem.clone("selected-tab-item", {
        borderColor: this.theme.activeColor,
        backgroundColor: this.theme.selectedBgColor,
        color: this.theme.selectedColor
    })
    .subClass(":hover", {
        backgroundColor: this.theme.selectedBgColor,
        color: this.theme.hoverColor
    });

    public readonly closeButton = this.createClass("close-button", {
        position: "absolute",
        right: "5px",
        top: "5px",
        width: "0",
        height: "0",
        padding: "8px",
        backgroundImage: `url(${ModuleFiles.src.web.images.closeButton_svg})`
    })
    .subClass(":hover", {
        backgroundImage: `url(${ModuleFiles.src.web.images.closeButtonHover_svg})`
    });

}
