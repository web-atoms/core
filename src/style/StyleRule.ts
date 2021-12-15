import { ColorItem } from "../core/Colors";
import WebImage from "../core/WebImage";
import { IStyleDeclaration } from "../web/styles/IStyleDeclaration";

export type StylePosition = "" | "default" | "initial" | "static" | "relative" | "absolute" | string;
export type TextAlignType = "" | "default" | "initial" | "left" | "right" | "center" | "justify";
export type FloatPosition = "" | "default" | "none" | "left" | "right" | "initial" | "inherit";
export type OverFlowType = "" | "default" | "visible" | "hidden" | "scroll" | "auto";
export type ItemAlignType =  "" | "default" | "stretch" | "center" |"flex-start" | "flex-end" | "baseline" |
"initial" | "inherit" | "start" | "end";
export type SelfAlignType =  "" | "default" | "auto" | "stretch" | "center" |"flex-start" | "flex-end" | "baseline" |
"initial" | "inherit";
export type ContentAlignType =  "" | "default" | "stretch" | "center" |"flex-start" | "flex-end" | "space-between" |
"space-around" | "initial" | "inherit";
export type JustifyType = "" | "default" | "auto" | "inter-word" | "inter-character" | "none" | "initial" |
"inherit";
export type TextSize = "" | "default" | "medium" | "xx-small" | "x-small" | "small" | "large" |
"x-large" | "xx-large" | "smaller" | "larger" | "initial" | "inherit";
export type AnimationType = "" | "animation-name" | "animation-duration" | "animation-timing-function" |
"animation-delay" | "animation-iteration-count" | "animation-direction" |"animation-fill-mode" |
"animation-play-state" | "initial" | "inherit";
export type AnimationNameType = "" | "keyframename" | "none" | "initial" | "inherit";
export type AnimationDirection = "" | "default" | "reverse" | "alternate" | "alternate-reverse" | "initial" |
"inherit";
export type AnimationTimeType = "" | "initial" | "inherit";
export type AnimationModeType = "" | "default" | "none" | "forwards" | "backwards" | "both" | "initial" |
"inherit";
export type IterationCount = "" | "default" | "infinite" | "initial" |"inherit";
export type PlayState = "" | "default" | "paused" | "running" | "initial" | "inherit";
export type TimingFunction = "" | "default" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" |
"step-start" | "step-end" | "steps()" | "cubic-bezier()" | "initial" | "inherit";
export type Visibility = "" | "default" | "visible" | "hidden" | "initial" | "inherit";
export type BackgroundType = "" | "background-color" | "background-image" | "background-position" |
"background-size" | "background-repeat" | "background-origin" |"background-clip" | "background-attachment" |
"initial" | "inherit";
export type BackgroundAttachmentType = "" | "default" | "scroll" | "fixed" | "local" |"initial" | "inherit" |
string;
export type BackgroundBlendType = "" | "default" | "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" |
"color-dodge" | "saturation" | "color" | "luminosity" |"initial" | "inherit";
export type BackgroundClipType = "" | "default" | "border-box" | "padding-box" | "content-box" |"initial" |
"inherit";
export type BackgroundImageType = "" | "default" | "url()" | "none" | "linear-gradient()" |"radial-gradient()" |
"repeating-linear-gradient()" | "repeating-radial-gradient()" | "initial" | "inherit";
export type BackgroundOriginType = "" | "default" | "padding-box" | "border-box" | "content-box" |"initial" |
"inherit";
export type BackgroundPositionType = "" | "default" | "left top" | "left center" | "left bottom" |"right top" |
"right center" | "right bottom" | "center top" | "center center" | "center bottom" | "0% 0%" | "0px 0px" |
"initial" | "inherit";
export type BackgroundRepeatType = "" | "default" | "repeat" | "repeat-x" | "repeat-y" | "no-repeat" | "space" |
"round" |"initial" | "inherit";
export type BackgroundSizeType = "" | "default" | "auto" | "0px" | "0px 0px" | "0%" | "50% 50%" | "cover" |
"contain" |"initial" | "inherit";
export type BorderStyleType = "" | "default" | "none" | "hidden" | "dotted" | "dashed" | "solid" | "double" |
"groove" | "ridge" | "inset" | "outset" | "initial" | "inherit";
export type CommonWidthType = "" | "default" | "medium" | "thin" | "thick" | "initial" | "inherit";
export type BorderCollapseType = "" | "default" | "separate" | "collapse" | "initial" | "inherit";
export type BorderImageRepeatType = "" | "default" | "stretch" | "repeat" | "round" | "space" | "initial" |
"inherit";
// export type BorderRadiusType = "" | "default" | "0px" | "0px 0px" | "0px 0px 0px" | "0px 0px 0px" | "0%" |
// "initial" | "inherit";
export type BorderSpacingType = "" | "default" | "0px" | "0px 0px" | "initial" | "inherit" | null | string;
export type BoxSizingType = "" | "default" | "border-box" | "content-box" |"initial" | "inherit";
export type CaptionSideType = "" | "default" | "top" | "bottom" | "initial" | "inherit";
export type ClearType = "" | "default" | "none" | "left" |"right" | "both" | "initial" | "inherit";
export type ColumnCountType = "" | "default" | "auto" | "initial" | "inherit" | number;
export type ColumnGapType = "" | "default" | "normal" | "initial" | "inherit";
export type ContentType = "" | "default" | "none" | "normal" | "counter" | "attr()" | "open-quote" | "close-quote" |
"no-open-quote" | "no-close-quote" | "url()" | "initial" | "inherit";
export type CursorType = "" | "alias" | "all-scroll" | "auto" | "cell" |"context-menu" |"col-resize" | "copy" |
"crosshair" | "default" | "e-resize" | "ew-resize" | "grab" | "grabbing" |"help" |"move" | "n-resize" | "ne-resize" |
"nesw-resize" | "ns-resize" | "nw-resize" | "nwse-resize" | "no-drop" | "none" | "not-allowed" | "pointer" |
"progress" | "row-resize" | "s-resize" | "se-resize" | "sw-resize" | "text" | "url()" | "vertical-text" | "w-resize" |
"wait" | "zoom-in" | "zoom-out" |"initial" | "inherit";
export type DirectionType = "" | "default" | "ltr" | "rtl" | "initial" | "inherit";
export type DisplayType = "" | "default" | "inline" | "block" | "contents" |"flex" | "grid" | "inline-block" |
"inline-flex" | "inline-grid" | "inline-table" | "list-item" | "run-in" | "table" | "table-caption" |
"table-column-group" | "table-header-group" | "table-footer-group" | "table-row-group" | "table-cell" |
"table-column" | "table-row" | "none" | "none" | "initial" | "inherit";
export type EmptyCellType = "" | "default" | "show" | "hide" | "initial" | "inherit";
export type FilterType = "" | "none" | "blur()" | "brightness()" | "contrast()" | "drop-shadow()" | "grayscale()" |
"hue-rotate()" | "invert()" | "opacity()" | "saturate()" | "sepia()" | "url()" | "initial" | "inherit";
export type FlexDirectionType = "" | "default" | "row" | "row-reverse" | "column" | "column-reverse" |
"initial" | "inherit";
export type FlexFlowDirectionType = "" | "default" | "column" | "column-reverse" | "nowrap" | "row" | "row-reverse" |
"unset" | "wrap" | "wrap-reverse" |"initial" | "inherit";
export type FlexWrapType = "" | "default" | "nowrap" | "wrap" | "wrap-reverse" | "initial" | "inherit";
export type FloatType = "" | "default" | "none" | "left" | "right" | "initial" | "inherit";
export type FontStretchType = "" | "default" | "ultra-condensed" | "extra-condensed" | "condensed" | "semi-condensed" |
"normal" | "semi-expanded" | "expanded" | "extra-expanded" | "ultra-expanded" | "initial" | "inherit";
export type FontStyleType = "" | "default" | "normal" | "italic" | "oblique" | "initial" | "inherit";
export type FontVariantType = "" | "default" | "normal" | "small-caps" | "initial" | "inherit";
export type FontWeightType = "" | "default" | "normal" | "bold" | "bolder" | "lighter" | "initial" | "inherit" |
string;
export type GridAutoColumnsType = "" | "default" | "auto" | "max-content" | "min-content";
export type GridAutoFlowType = "" | "default" | "row" | "column" | "row dense" | "column dense";
export type GridAutoRowsType = "" | "default" | "auto" | "max-content" | "min-content";
export type JustifyContentType = "" | "default" | "flex-start" | "flex-end" | "center" | "space-between" |
"space-around" | "initial" | "inherit";
export type ListStylePositionType = "" | "default" | "inside" | "max-content" | "outside" | "initial" |
"inherit";
export type ListStyleType = "" | "default" | "disc" | "circle" | "none" | "square";
export type ObjectFitType = "" | "default" | "fill" | "contain" | "cover" | "none" | "scale-down" |
"initial" | "inherit";
export type ObjectPositionType = "" | "default" | "fill" | "contain" | "cover" | "none" | "scale-down" |
"initial" | "inherit";
export type PageBreakCommonType = "" | "default" | "auto" | "always" | "avoid" | "left" | "right" |
"initial" | "inherit";
export type PageBreakInsideType = "" | "default" | "auto"| "avoid" | "initial" | "inherit";
export type ResizeType = "" | "default" | "none" | "both" | "horizontal" | "vertical" | "initial" |
"inherit";
export type TableLayoutType = "" | "default" | "auto" | "fixed" | "initial" | "inherit";
export type TextAlignLastType = "" | "default" | "auto" | "left" | "right" | "center" | "justify" |
"start" | "end" | "initial" | "inherit"| string;
export type TextDecorationType = "" | "none" | "underline" | "overline" | "line-through" |
"initial" | "inherit";
export type TextTransformType = "" | "none" | "capitalize" | "uppercase" | "lowercase" | "initial" |
"inherit";
export type TransformType = "" | "default" | "none" | "matrix()" | "matrix3d()" | "translate()" | "translate3d()" |
"translateX()" | "translateY()" | "translateZ()" | "scale()" | "scale3d()" | "scaleX()" | "scaleY()" | "scaleZ()" |
"rotate()" | "rotate3d()" | "rotateX()" | "rotateY()" | "rotateZ()" | "skew()" | "skewX()" | "skewY()" |
"perspective()" | "initial" | "inherit";
export type TransformStyleType = "" | "default" | "flat" | "preserve-3d" | "initial" | "inherit";
export type VisibilityType = "" | "default" | "visible" | "hidden" | "collapse" | "initial" | "inherit";
export type WhiteSpaceType = "" | "default" | "normal" | "nowrap" | "pre" | "pre-line" | "pre-wrap" |
"initial" | "inherit";
export type WordBreakType = "" | "default" | "normal" | "break-all" | "keep-all" | "break-word" |
"initial" | "inherit";
export type WordSpacingType = "" | "default" | "normal" | "initial" | "inherit";
export type WordWrapType = "" | "default" | "normal" | "break-word" | "initial" | "inherit";

export type Units = "" | "px" | "pt" | "%" | "rem";

export interface IFlexAttributes {
    direction?: FlexDirectionType;
    alignItems?: ItemAlignType;
    justifyContent?: JustifyContentType;
    stretch?: boolean;
    inline?: boolean;
    gap?: number;
}

export function toUnit(n: number | string, unit: string) {
    if (!unit) {
        unit = "";
    }
    return typeof n === "number" ? n + unit : n;
}

export interface IRect {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    width?: number | string;
    height?: number | string;
}

export class AtomStyleRules {

    public style: IStyleDeclaration = {};

    public name: string;

    constructor(name: string | object) {
        if (typeof name === "string") {
            this.name = name;
        } else {
            this.style = name ?? {};
        }
    }

    public alignContent(value: ContentAlignType) {
        if (value !== undefined && value !== null) {
            this.style.alignContent = value;
        }
        return this;
    }

    public alignItems(value: ItemAlignType) {
        if (value !== undefined && value !== null) {
            this.style.alignItems = value;
        }
        return this;
    }

    public alignSelf(value: SelfAlignType) {
        if (value !== undefined && value !== null) {
            this.style.alignSelf = value;
        }
        return this;
    }

    public alignmentBaseline(value: string) {
        if (value !== undefined && value !== null) {
            this.style.alignmentBaseline = value;
        }
        return this;
    }

    public animation(value: AnimationType) {
        if (value !== undefined && value !== null) {
            this.style.animation = value;
        }
        return this;
    }

    public animationDelay(value: AnimationTimeType) {
        if (value !== undefined && value !== null) {
            this.style.animationDelay = value;
        }
        return this;
    }

    public animationDirection(value: AnimationDirection) {
        if (value !== undefined && value !== null) {
            this.style.animationDirection = value;
        }
        return this;
    }

    public animationDuration(value: AnimationTimeType) {
        if (value !== undefined && value !== null) {
            this.style.animationDuration = value;
        }
        return this;
    }

    public animationFillMode(value: AnimationModeType) {
        if (value !== undefined && value !== null) {
            this.style.animationFillMode = value;
        }
        return this;
    }

    public animationIterationCount(value: IterationCount) {
        if (value !== undefined && value !== null) {
            this.style.animationIterationCount = value;
        }
        return this;
    }

    public animationName(value: AnimationNameType) {
        if (value !== undefined && value !== null) {
            this.style.animationName = value;
        }
        return this;
    }

    public animationPlayState(value: PlayState) {
        if (value !== undefined && value !== null) {
            this.style.animationPlayState = value;
        }
        return this;
    }

    public animationTimingFunction(value: TimingFunction) {
        if (value !== undefined && value !== null) {
            this.style.animationTimingFunction = value;
        }
        return this;
    }

    public backfaceVisibility(value: Visibility) {
        if (value !== undefined && value !== null) {
            this.style.backfaceVisibility = value;
        }
        return this;
    }

    public background(value: BackgroundType) {
        if (value !== undefined && value !== null) {
            this.style.background = value;
        }
        return this;
    }

    public backgroundAttachment(value: BackgroundAttachmentType) {
        if (value !== undefined && value !== null) {
            this.style.backgroundAttachment = value;
        }
        return this;
    }

    public backgroundBlendMode(value: BackgroundBlendType) {
        if (value !== undefined && value !== null) {
            this.style.backgroundBlendMode = value;
        }
        return this;
    }

    public backgroundClip(value: BackgroundClipType) {
        if (value !== undefined && value !== null) {
            this.style.backgroundClip = value;
        }
        return this;
    }

    public backgroundColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.backgroundColor = value;
        }
        return this;
    }

    public backgroundImage(value: string | WebImage) {
        if (value !== undefined && value !== null) {
            this.style.backgroundImage = value;
        }
        return this;
    }

    public backgroundOrigin(value: BackgroundOriginType) {
        if (value !== undefined && value !== null) {
            this.style.backgroundOrigin = value;
        }
        return this;
    }

    public backgroundPosition(value: BackgroundPositionType) {
        if (value !== undefined && value !== null) {
            this.style.backgroundPosition = value;
        }
        return this;
    }

    public backgroundPositionX(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.backgroundPositionX = toUnit(value, unit);
        }
        return this;
    }

    public backgroundPositionY(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.backgroundPositionY = toUnit(value, unit);
        }
        return this;
    }

    public backgroundRepeat(value: BackgroundRepeatType) {
        if (value !== undefined && value !== null) {
            this.style.backgroundRepeat = value;
        }
        return this;
    }

    public backgroundSize(value: BackgroundSizeType) {
        if (value !== undefined && value !== null) {
            this.style.backgroundSize = value;
        }
        return this;
    }

    public baselineShift(value: string) {
        if (value !== undefined && value !== null) {
            this.style.baselineShift = value;
        }
        return this;
    }

    public border(value: string) {
        if (value !== undefined && value !== null) {
            this.style.border = value;
        }
        return this;
    }

    public borderBottom(value: string) {
        if (value !== undefined && value !== null) {
            this.style.borderBottom = value;
        }
        return this;
    }

    public borderBottomColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.borderBottomColor = value;
        }
        return this;
    }

    public borderBottomLeftRadius(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.borderBottomLeftRadius = toUnit(value, unit);
        }
        return this;
    }

    public borderBottomRightRadius(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.borderBottomRightRadius = toUnit(value, unit);
        }
        return this;
    }

    public borderBottomStyle(value: BorderStyleType) {
        if (value !== undefined && value !== null) {
            this.style.borderBottomStyle = value;
        }
        return this;
    }

    public borderBottomWidth(value: CommonWidthType): AtomStyleRules;
    public borderBottomWidth(value: string): AtomStyleRules;
    public borderBottomWidth(value: number, unit?: Units): AtomStyleRules;
    public borderBottomWidth(value: number | string | CommonWidthType, unit: Units = "px"): AtomStyleRules {
        if (value !== undefined && value !== null) {
            this.style.borderBottomWidth = toUnit(value, unit);
        }
        return this;
    }

    public borderCollapse(value: BorderCollapseType) {
        if (value !== undefined && value !== null) {
            this.style.borderCollapse = value;
        }
        return this;
    }

    public borderColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.borderColor = value;
        }
        return this;
    }

    public borderImage(value: string) {
        if (value !== undefined && value !== null) {
            this.style.borderImage = value;
        }
        return this;
    }

    public borderImageOutset(value: string) {
        if (value !== undefined && value !== null) {
            this.style.borderImageOutset = value;
        }
        return this;
    }

    public borderImageRepeat(value: BorderImageRepeatType) {
        if (value !== undefined && value !== null) {
            this.style.borderImageRepeat = value;
        }
        return this;
    }

    public borderImageSlice(value: string) {
        if (value !== undefined && value !== null) {
            this.style.borderImageSlice = value;
        }
        return this;
    }

    public borderImageSource(value: string) {
        if (value !== undefined && value !== null) {
            this.style.borderImageSource = value;
        }
        return this;
    }

    public borderImageWidth(value: string) {
        if (value !== undefined && value !== null) {
            this.style.borderImageWidth = value;
        }
        return this;
    }

    public borderLeft(value: string) {
        if (value !== undefined && value !== null) {
            this.style.borderLeft = value;
        }
        return this;
    }

    public borderLeftColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.borderLeftColor = value;
        }
        return this;
    }

    public borderLeftStyle(value: BorderStyleType) {
        if (value !== undefined && value !== null) {
            this.style.borderLeftStyle = value;
        }
        return this;
    }

    public borderLeftWidth(value: CommonWidthType): AtomStyleRules;
    public borderLeftWidth(value: string): AtomStyleRules;
    public borderLeftWidth(value: number, unit?: Units): AtomStyleRules;
    public borderLeftWidth(value: number | string | CommonWidthType, unit: Units = "px"): AtomStyleRules {
        if (value !== undefined && value !== null) {
            this.style.borderLeftWidth = toUnit(value, unit);
        }
        return this;
    }

    public borderRadius(value: string | number, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.borderRadius = toUnit(value, unit);
        }
        return this;
    }

    public borderRight(value: string) {
        if (value !== undefined && value !== null) {
            this.style.borderRight = value;
        }
        return this;
    }

    public borderRightColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.borderRightColor = value;
        }
        return this;
    }

    public borderRightStyle(value: BorderStyleType) {
        if (value !== undefined && value !== null) {
            this.style.borderRightStyle = value;
        }
        return this;
    }

    public borderRightWidth(value: CommonWidthType): AtomStyleRules;
    public borderRightWidth(value: string): AtomStyleRules;
    public borderRightWidth(value: number, unit?: Units): AtomStyleRules;
    public borderRightWidth(value: number | string | CommonWidthType, unit: Units = "px"): AtomStyleRules {
        if (value !== undefined && value !== null) {
            this.style.borderRightWidth = toUnit(value, unit);
        }
        return this;
    }

    public borderSpacing(value: BorderSpacingType) {
        if (value !== undefined && value !== null) {
            this.style.borderSpacing = value;
        }
        return this;
    }

    public borderStyle(value: BorderStyleType) {
        if (value !== undefined && value !== null) {
            this.style.borderStyle = value;
        }
        return this;
    }

    public borderTop(value: string) {
        if (value !== undefined && value !== null) {
            this.style.borderTop = value;
        }
        return this;
    }

    public borderTopColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.borderTopColor = value;
        }
        return this;
    }

    public borderTopLeftRadius(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.borderTopLeftRadius = toUnit(value, unit);
        }
        return this;
    }

    public borderTopRightRadius(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.borderTopRightRadius = toUnit(value, unit);
        }
        return this;
    }

    public borderTopStyle(value: BorderStyleType) {
        if (value !== undefined && value !== null) {
            this.style.borderTopStyle = value;
        }
        return this;
    }

    public borderTopWidth(value: CommonWidthType): AtomStyleRules;
    public borderTopWidth(value: string): AtomStyleRules;
    public borderTopWidth(value: number, unit?: Units): AtomStyleRules;
    public borderTopWidth(value: number | string | CommonWidthType, unit: Units = "px"): AtomStyleRules {
        if (value !== undefined && value !== null) {
            this.style.borderTopWidth = toUnit(value, unit);
        }
        return this;
    }

    public borderWidth(value: CommonWidthType): AtomStyleRules;
    public borderWidth(value: string): AtomStyleRules;
    public borderWidth(value: number, unit?: Units): AtomStyleRules;
    public borderWidth(value: number | string | CommonWidthType, unit: Units = "px"): AtomStyleRules {
        if (value !== undefined && value !== null) {
            this.style.borderWidth = toUnit(value, unit);
        }
        return this;
    }

    public bottom(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.bottom = toUnit(value, unit);
        }
        return this;
    }

    public boxShadow(value: string) {
        if (value !== undefined && value !== null) {
            this.style.boxShadow = value;
        }
        return this;
    }

    public boxSizing(value: BoxSizingType) {
        if (value !== undefined && value !== null) {
            this.style.boxSizing = value;
        }
        return this;
    }

    public breakAfter(value: string) {
        if (value !== undefined && value !== null) {
            this.style.breakAfter = value;
        }
        return this;
    }

    public breakBefore(value: string) {
        if (value !== undefined && value !== null) {
            this.style.breakBefore = value;
        }
        return this;
    }

    public breakInside(value: string) {
        if (value !== undefined && value !== null) {
            this.style.breakInside = value;
        }
        return this;
    }

    public captionSide(value: CaptionSideType) {
        if (value !== undefined && value !== null) {
            this.style.captionSide = value;
        }
        return this;
    }

    public clear(value: ClearType) {
        if (value !== undefined && value !== null) {
            this.style.clear = value;
        }
        return this;
    }

    public clip(value: string) {
        if (value !== undefined && value !== null) {
            this.style.clip = value;
        }
        return this;
    }

    public clipPath(value: string) {
        if (value !== undefined && value !== null) {
            this.style.clipPath = value;
        }
        return this;
    }

    public clipRule(value: string) {
        if (value !== undefined && value !== null) {
            this.style.clipRule = value;
        }
        return this;
    }

    public color(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.color = value;
        }
        return this;
    }

    public colorInterpolationFilters(value: string) {
        if (value !== undefined && value !== null) {
            this.style.colorInterpolationFilters = value;
        }
        return this;
    }

    public columnCount(value: any) {
        if (value !== undefined && value !== null) {
            this.style.columnCount = value;
        }
        return this;
    }

    public columnFill(value: string) {
        if (value !== undefined && value !== null) {
            this.style.columnFill = value;
        }
        return this;
    }

    public columnGap(value: ColumnGapType) {
        if (value !== undefined && value !== null) {
            this.style.columnGap = value;
        }
        return this;
    }

    public columnRule(value: string) {
        if (value !== undefined && value !== null) {
            this.style.columnRule = value;
        }
        return this;
    }

    public columnRuleColor(value: any | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.columnRuleColor = value;
        }
        return this;
    }

    public columnRuleStyle(value: BorderStyleType) {
        if (value !== undefined && value !== null) {
            this.style.columnRuleStyle = value;
        }
        return this;
    }

    public columnRuleWidth(value: CommonWidthType) {
        if (value !== undefined && value !== null) {
            this.style.columnRuleWidth = value;
        }
        return this;
    }

    public columnSpan(value: string) {
        if (value !== undefined && value !== null) {
            this.style.columnSpan = value;
        }
        return this;
    }

    public columnWidth(value: any) {
        if (value !== undefined && value !== null) {
            this.style.columnWidth = value;
        }
        return this;
    }

    public columns(value: string) {
        if (value !== undefined && value !== null) {
            this.style.columns = value;
        }
        return this;
    }

    public content(value: ContentType) {
        if (value !== undefined && value !== null) {
            this.style.content = value;
        }
        return this;
    }

    public counterIncrement(value: string) {
        if (value !== undefined && value !== null) {
            this.style.counterIncrement = value;
        }
        return this;
    }

    public counterReset(value: string) {
        if (value !== undefined && value !== null) {
            this.style.counterReset = value;
        }
        return this;
    }

    public cssFloat(value: FloatPosition) {
        if (value !== undefined && value !== null) {
            this.style.cssFloat = value;
        }
        return this;
    }

    public cssText(value: string) {
        if (value !== undefined && value !== null) {
            this.style.cssText = value;
        }
        return this;
    }

    public cursor(value: CursorType) {
        if (value !== undefined && value !== null) {
            this.style.cursor = value;
        }
        return this;
    }

    public direction(value: DirectionType) {
        if (value !== undefined && value !== null) {
            this.style.direction = value;
        }
        return this;
    }

    public display(value: DisplayType) {
        if (value !== undefined && value !== null) {
            this.style.display = value;
        }
        return this;
    }

    public dominantBaseline(value: string) {
        if (value !== undefined && value !== null) {
            this.style.dominantBaseline = value;
        }
        return this;
    }

    public emptyCells(value: EmptyCellType) {
        if (value !== undefined && value !== null) {
            this.style.emptyCells = value;
        }
        return this;
    }

    public enableBackground(value: string) {
        if (value !== undefined && value !== null) {
            this.style.enableBackground = value;
        }
        return this;
    }

    public fill(value: string) {
        if (value !== undefined && value !== null) {
            this.style.fill = value;
        }
        return this;
    }

    public fillOpacity(value: string) {
        if (value !== undefined && value !== null) {
            this.style.fillOpacity = value;
        }
        return this;
    }

    public fillRule(value: string) {
        if (value !== undefined && value !== null) {
            this.style.fillRule = value;
        }
        return this;
    }

    public filter(value: FilterType) {
        if (value !== undefined && value !== null) {
            this.style.filter = value;
        }
        return this;
    }

    public flex(value: string) {
        if (value !== undefined && value !== null) {
            this.style.flex = value;
        }
        return this;
    }

    public flexBasis(value: string) {
        if (value !== undefined && value !== null) {
            this.style.flexBasis = value;
        }
        return this;
    }

    public flexDirection(value: FlexDirectionType) {
        if (value !== undefined && value !== null) {
            this.style.flexDirection = value;
        }
        return this;
    }

    public flexFlow(value: FlexFlowDirectionType) {
        if (value !== undefined && value !== null) {
            this.style.flexFlow = value;
        }
        return this;
    }

    public flexGrow(value: string) {
        if (value !== undefined && value !== null) {
            this.style.flexGrow = value;
        }
        return this;
    }

    public flexShrink(value: string) {
        if (value !== undefined && value !== null) {
            this.style.flexShrink = value;
        }
        return this;
    }

    public flexWrap(value: FlexWrapType) {
        if (value !== undefined && value !== null) {
            this.style.flexWrap = value;
        }
        return this;
    }

    public float(value: FloatType) {
        if (value !== undefined && value !== null) {
            this.style.float = value;
        }
        return this;
    }

    public floodColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.floodColor = value;
        }
        return this;
    }

    public floodOpacity(value: string) {
        if (value !== undefined && value !== null) {
            this.style.floodOpacity = value;
        }
        return this;
    }

    public font(value: string) {
        if (value !== undefined && value !== null) {
            this.style.font = value;
        }
        return this;
    }

    public fontFamily(value: string) {
        if (value !== undefined && value !== null) {
            this.style.fontFamily = value;
        }
        return this;
    }

    public fontFeatureSettings(value: string) {
        if (value !== undefined && value !== null) {
            this.style.fontFeatureSettings = value;
        }
        return this;
    }

    public fontSize(value: number): AtomStyleRules;
    public fontSize(value: TextSize): AtomStyleRules;
    public fontSize(value: string): AtomStyleRules;
    public fontSize(value: number | string | TextSize, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.fontSize = toUnit(value, unit);
        }
        return this;
    }

    public fontSizeAdjust(value: string) {
        if (value !== undefined && value !== null) {
            this.style.fontSizeAdjust = value;
        }
        return this;
    }

    public fontStretch(value: FontStretchType) {
        if (value !== undefined && value !== null) {
            this.style.fontStretch = value;
        }
        return this;
    }

    public fontStyle(value: FontStyleType) {
        if (value !== undefined && value !== null) {
            this.style.fontStyle = value;
        }
        return this;
    }

    public fontVariant(value: FontVariantType) {
        if (value !== undefined && value !== null) {
            this.style.fontVariant = value;
        }
        return this;
    }

    public fontWeight(value: FontWeightType) {
        if (value !== undefined && value !== null) {
            this.style.fontWeight = value;
        }
        return this;
    }

    public gap(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.gap = toUnit(value, unit);
        }
        return this;
    }

    public glyphOrientationHorizontal(value: string) {
        if (value !== undefined && value !== null) {
            this.style.glyphOrientationHorizontal = value;
        }
        return this;
    }

    public glyphOrientationVertical(value: string) {
        if (value !== undefined && value !== null) {
            this.style.glyphOrientationVertical = value;
        }
        return this;
    }

    public grid(value: string) {
        if (value !== undefined && value !== null) {
            this.style.grid = value;
        }
        return this;
    }

    public gridArea(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridArea = value;
        }
        return this;
    }

    public gridAutoColumns(value: GridAutoColumnsType) {
        if (value !== undefined && value !== null) {
            this.style.gridAutoColumns = value;
        }
        return this;
    }

    public gridAutoFlow(value: GridAutoFlowType) {
        if (value !== undefined && value !== null) {
            this.style.gridAutoFlow = value;
        }
        return this;
    }

    public gridAutoRows(value: GridAutoRowsType) {
        if (value !== undefined && value !== null) {
            this.style.gridAutoRows = value;
        }
        return this;
    }

    public gridColumn(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridColumn = value;
        }
        return this;
    }

    public gridColumnEnd(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridColumnEnd = value;
        }
        return this;
    }

    public gridColumnGap(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridColumnGap = value;
        }
        return this;
    }

    public gridColumnStart(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridColumnStart = value;
        }
        return this;
    }

    public gridGap(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridGap = value;
        }
        return this;
    }

    public gridRow(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridRow = value;
        }
        return this;
    }

    public gridRowEnd(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridRowEnd = value;
        }
        return this;
    }

    public gridRowGap(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridRowGap = value;
        }
        return this;
    }

    public gridRowStart(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridRowStart = value;
        }
        return this;
    }

    public gridTemplate(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridTemplate = value;
        }
        return this;
    }

    public gridTemplateAreas(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridTemplateAreas = value;
        }
        return this;
    }

    public gridTemplateColumns(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridTemplateColumns = value;
        }
        return this;
    }

    public gridTemplateRows(value: string) {
        if (value !== undefined && value !== null) {
            this.style.gridTemplateRows = value;
        }
        return this;
    }

    public height(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.height = toUnit(value, unit);
        }
        return this;
    }

    public imeMode(value: string) {
        if (value !== undefined && value !== null) {
            this.style.imeMode = value;
        }
        return this;
    }

    public justifyContent(value: JustifyContentType) {
        if (value !== undefined && value !== null) {
            this.style.justifyContent = value;
        }
        return this;
    }

    public justifyItems(value: string) {
        if (value !== undefined && value !== null) {
            this.style.justifyItems = value;
        }
        return this;
    }

    public justifySelf(value: string) {
        if (value !== undefined && value !== null) {
            this.style.justifySelf = value;
        }
        return this;
    }

    public kerning(value: string) {
        if (value !== undefined && value !== null) {
            this.style.kerning = value;
        }
        return this;
    }

    public layoutGrid(value: string) {
        if (value !== undefined && value !== null) {
            this.style.layoutGrid = value;
        }
        return this;
    }

    public layoutGridChar(value: string) {
        if (value !== undefined && value !== null) {
            this.style.layoutGridChar = value;
        }
        return this;
    }

    public layoutGridLine(value: string) {
        if (value !== undefined && value !== null) {
            this.style.layoutGridLine = value;
        }
        return this;
    }

    public layoutGridMode(value: string) {
        if (value !== undefined && value !== null) {
            this.style.layoutGridMode = value;
        }
        return this;
    }

    public layoutGridType(value: string) {
        if (value !== undefined && value !== null) {
            this.style.layoutGridType = value;
        }
        return this;
    }

    public left(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.left = toUnit(value, unit);
        }
        return this;
    }

    public letterSpacing(value: string) {
        if (value !== undefined && value !== null) {
            this.style.letterSpacing = value;
        }
        return this;
    }

    public lightingColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.lightingColor = value;
        }
        return this;
    }

    public lineBreak(value: string) {
        if (value !== undefined && value !== null) {
            this.style.lineBreak = value;
        }
        return this;
    }

    public lineHeight(value: string) {
        if (value !== undefined && value !== null) {
            this.style.lineHeight = value;
        }
        return this;
    }

    public listStyle(value: string) {
        if (value !== undefined && value !== null) {
            this.style.listStyle = value;
        }
        return this;
    }

    public listStyleImage(value: string) {
        if (value !== undefined && value !== null) {
            this.style.listStyleImage = value;
        }
        return this;
    }

    public listStylePosition(value: ListStylePositionType) {
        if (value !== undefined && value !== null) {
            this.style.listStylePosition = value;
        }
        return this;
    }

    public listStyleType(value: ListStyleType) {
        if (value !== undefined && value !== null) {
            this.style.listStyleType = value;
        }
        return this;
    }

    public margin(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.margin = toUnit(value, unit);
        }
        return this;
    }

    public marginBottom(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.marginBottom = toUnit(value, unit);
        }
        return this;
    }

    public marginLeft(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.marginLeft = toUnit(value, unit);
        }
        return this;
    }

    public marginRight(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.marginRight = toUnit(value, unit);
        }
        return this;
    }

    public marginTop(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.marginTop = toUnit(value, unit);
        }
        return this;
    }

    public marginInlineStart(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.marginInlineStart = toUnit(value, unit);
        }
        return this;
    }

    public marginInlineEnd(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.marginInlineEnd = toUnit(value, unit);
        }
        return this;
    }

    public marginBlockStart(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.marginBlockStart = toUnit(value, unit);
        }
        return this;
    }

    public marginBlockEnd(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.marginBlockEnd = toUnit(value, unit);
        }
        return this;
    }

    public marker(value: string) {
        if (value !== undefined && value !== null) {
            this.style.marker = value;
        }
        return this;
    }

    public markerEnd(value: string) {
        if (value !== undefined && value !== null) {
            this.style.markerEnd = value;
        }
        return this;
    }

    public markerMid(value: string) {
        if (value !== undefined && value !== null) {
            this.style.markerMid = value;
        }
        return this;
    }

    public markerStart(value: string) {
        if (value !== undefined && value !== null) {
            this.style.markerStart = value;
        }
        return this;
    }

    public mask(value: string) {
        if (value !== undefined && value !== null) {
            this.style.mask = value;
        }
        return this;
    }

    public maskImage(value: string) {
        if (value !== undefined && value !== null) {
            this.style.maskImage = value;
        }
        return this;
    }

    public maxHeight(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.maxHeight = toUnit(value, unit);
        }
        return this;
    }

    public maxWidth(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.maxWidth = toUnit(value, unit);
        }
        return this;
    }

    public minHeight(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.minHeight = toUnit(value, unit);
        }
        return this;
    }

    public minWidth(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.minWidth = toUnit(value, unit);
        }
        return this;
    }

    public msContentZoomChaining(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msContentZoomChaining = value;
        }
        return this;
    }

    public msContentZoomLimit(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msContentZoomLimit = value;
        }
        return this;
    }

    public msContentZoomLimitMax(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msContentZoomLimitMax = value;
        }
        return this;
    }

    public msContentZoomLimitMin(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msContentZoomLimitMin = value;
        }
        return this;
    }

    public msContentZoomSnap(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msContentZoomSnap = value;
        }
        return this;
    }

    public msContentZoomSnapPoints(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msContentZoomSnapPoints = value;
        }
        return this;
    }

    public msContentZoomSnapType(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msContentZoomSnapType = value;
        }
        return this;
    }

    public msContentZooming(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msContentZooming = value;
        }
        return this;
    }

    public msFlowFrom(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msFlowFrom = value;
        }
        return this;
    }

    public msFlowInto(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msFlowInto = value;
        }
        return this;
    }

    public msFontFeatureSettings(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msFontFeatureSettings = value;
        }
        return this;
    }

    public msGridColumn(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msGridColumn = value;
        }
        return this;
    }

    public msGridColumnAlign(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msGridColumnAlign = value;
        }
        return this;
    }

    public msGridColumnSpan(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msGridColumnSpan = value;
        }
        return this;
    }

    public msGridColumns(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msGridColumns = value;
        }
        return this;
    }

    public msGridRow(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msGridRow = value;
        }
        return this;
    }

    public msGridRowAlign(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msGridRowAlign = value;
        }
        return this;
    }

    public msGridRowSpan(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msGridRowSpan = value;
        }
        return this;
    }

    public msGridRows(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msGridRows = value;
        }
        return this;
    }

    public msHighContrastAdjust(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msHighContrastAdjust = value;
        }
        return this;
    }

    public msHyphenateLimitChars(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msHyphenateLimitChars = value;
        }
        return this;
    }

    public msHyphenateLimitLines(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msHyphenateLimitLines = value;
        }
        return this;
    }

    public msHyphenateLimitZone(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msHyphenateLimitZone = value;
        }
        return this;
    }

    public msHyphens(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msHyphens = value;
        }
        return this;
    }

    public msImeAlign(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msImeAlign = value;
        }
        return this;
    }

    public msOverflowStyle(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msOverflowStyle = value;
        }
        return this;
    }

    public msScrollChaining(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msScrollChaining = value;
        }
        return this;
    }

    public msScrollLimit(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msScrollLimit = value;
        }
        return this;
    }

    public msScrollLimitXMax(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msScrollLimitXMax = value;
        }
        return this;
    }

    public msScrollLimitXMin(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msScrollLimitXMin = value;
        }
        return this;
    }

    public msScrollLimitYMax(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msScrollLimitYMax = value;
        }
        return this;
    }

    public msScrollLimitYMin(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msScrollLimitYMin = value;
        }
        return this;
    }

    public msScrollRails(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msScrollRails = value;
        }
        return this;
    }

    public msScrollSnapPointsX(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msScrollSnapPointsX = value;
        }
        return this;
    }

    public msScrollSnapPointsY(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msScrollSnapPointsY = value;
        }
        return this;
    }

    public msScrollSnapType(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msScrollSnapType = value;
        }
        return this;
    }

    public msScrollSnapX(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msScrollSnapX = value;
        }
        return this;
    }

    public msScrollSnapY(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msScrollSnapY = value;
        }
        return this;
    }

    public msScrollTranslation(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msScrollTranslation = value;
        }
        return this;
    }

    public msTextCombineHorizontal(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msTextCombineHorizontal = value;
        }
        return this;
    }

    public msTextSizeAdjust(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msTextSizeAdjust = value;
        }
        return this;
    }

    public msTouchAction(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msTouchAction = value;
        }
        return this;
    }

    public msTouchSelect(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msTouchSelect = value;
        }
        return this;
    }

    public msUserSelect(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msUserSelect = value;
        }
        return this;
    }

    public msWrapFlow(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msWrapFlow = value;
        }
        return this;
    }

    public msWrapMargin(value: any) {
        if (value !== undefined && value !== null) {
            this.style.msWrapMargin = value;
        }
        return this;
    }

    public msWrapThrough(value: string) {
        if (value !== undefined && value !== null) {
            this.style.msWrapThrough = value;
        }
        return this;
    }

    public objectFit(value: ObjectFitType) {
        if (value !== undefined && value !== null) {
            this.style.objectFit = value;
        }
        return this;
    }

    public objectPosition(value: ObjectPositionType) {
        if (value !== undefined && value !== null) {
            this.style.objectPosition = value;
        }
        return this;
    }

    public opacity(value: string) {
        if (value !== undefined && value !== null) {
            this.style.opacity = value;
        }
        return this;
    }

    public order(value: string) {
        if (value !== undefined && value !== null) {
            this.style.order = value;
        }
        return this;
    }

    public orphans(value: string) {
        if (value !== undefined && value !== null) {
            this.style.orphans = value;
        }
        return this;
    }

    public outline(value: string) {
        if (value !== undefined && value !== null) {
            this.style.outline = value;
        }
        return this;
    }

    public outlineColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.outlineColor = value;
        }
        return this;
    }

    public outlineOffset(value: string) {
        if (value !== undefined && value !== null) {
            this.style.outlineOffset = value;
        }
        return this;
    }

    public outlineStyle(value: BorderStyleType) {
        if (value !== undefined && value !== null) {
            this.style.outlineStyle = value;
        }
        return this;
    }

    public outlineWidth(value: CommonWidthType) {
        if (value !== undefined && value !== null) {
            this.style.outlineWidth = value;
        }
        return this;
    }

    public overflow(value: OverFlowType) {
        if (value !== undefined && value !== null) {
            this.style.overflow = value;
        }
        return this;
    }

    public overflowX(value: OverFlowType) {
        if (value !== undefined && value !== null) {
            this.style.overflowX = value;
        }
        return this;
    }

    public overflowY(value: OverFlowType) {
        if (value !== undefined && value !== null) {
            this.style.overflowY = value;
        }
        return this;
    }

    public padding(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.padding = toUnit(value, unit);
        }
        return this;
    }

    public paddingBottom(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.paddingBottom = toUnit(value, unit);
        }
        return this;
    }

    public paddingLeft(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.paddingLeft = toUnit(value, unit);
        }
        return this;
    }

    public paddingRight(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.paddingRight = toUnit(value, unit);
        }
        return this;
    }

    public paddingTop(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.paddingTop = toUnit(value, unit);
        }
        return this;
    }

    public paddingInlineStart(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.paddingInlineStart = toUnit(value, unit);
        }
        return this;
    }

    public paddingInlineEnd(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.paddingInlineEnd = toUnit(value, unit);
        }
        return this;
    }

    public pageBreakAfter(value: PageBreakCommonType) {
        if (value !== undefined && value !== null) {
            this.style.pageBreakAfter = value;
        }
        return this;
    }

    public pageBreakBefore(value: PageBreakCommonType) {
        if (value !== undefined && value !== null) {
            this.style.pageBreakBefore = value;
        }
        return this;
    }

    public pageBreakInside(value: PageBreakInsideType) {
        if (value !== undefined && value !== null) {
            this.style.pageBreakInside = value;
        }
        return this;
    }

    public penAction(value: string) {
        if (value !== undefined && value !== null) {
            this.style.penAction = value;
        }
        return this;
    }

    public perspective(value: string) {
        if (value !== undefined && value !== null) {
            this.style.perspective = value;
        }
        return this;
    }

    public perspectiveOrigin(value: string) {
        if (value !== undefined && value !== null) {
            this.style.perspectiveOrigin = value;
        }
        return this;
    }

    public pointerEvents(value: string) {
        if (value !== undefined && value !== null) {
            this.style.pointerEvents = value;
        }
        return this;
    }

    public position(value: StylePosition) {
        if (value !== undefined && value !== null) {
            this.style.position = value;
        }
        return this;
    }

    public quotes(value: string) {
        if (value !== undefined && value !== null) {
            this.style.quotes = value;
        }
        return this;
    }

    public resize(value: ResizeType) {
        if (value !== undefined && value !== null) {
            this.style.resize = value;
        }
        return this;
    }

    public right(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.right = toUnit(value, unit);
        }
        return this;
    }

    public rotate(value: string) {
        if (value !== undefined && value !== null) {
            this.style.rotate = value;
        }
        return this;
    }

    public rowGap(value: string) {
        if (value !== undefined && value !== null) {
            this.style.rowGap = value;
        }
        return this;
    }

    public rubyAlign(value: string) {
        if (value !== undefined && value !== null) {
            this.style.rubyAlign = value;
        }
        return this;
    }

    public rubyOverhang(value: string) {
        if (value !== undefined && value !== null) {
            this.style.rubyOverhang = value;
        }
        return this;
    }

    public rubyPosition(value: string) {
        if (value !== undefined && value !== null) {
            this.style.rubyPosition = value;
        }
        return this;
    }

    public scale(value: string) {
        if (value !== undefined && value !== null) {
            this.style.scale = value;
        }
        return this;
    }

    public stopColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.stopColor = value;
        }
        return this;
    }

    public stopOpacity(value: string) {
        if (value !== undefined && value !== null) {
            this.style.stopOpacity = value;
        }
        return this;
    }

    public stroke(value: string) {
        if (value !== undefined && value !== null) {
            this.style.stroke = value;
        }
        return this;
    }

    public strokeDasharray(value: string) {
        if (value !== undefined && value !== null) {
            this.style.strokeDasharray = value;
        }
        return this;
    }

    public strokeDashoffset(value: string) {
        if (value !== undefined && value !== null) {
            this.style.strokeDashoffset = value;
        }
        return this;
    }

    public strokeLinecap(value: string) {
        if (value !== undefined && value !== null) {
            this.style.strokeLinecap = value;
        }
        return this;
    }

    public strokeLinejoin(value: string) {
        if (value !== undefined && value !== null) {
            this.style.strokeLinejoin = value;
        }
        return this;
    }

    public strokeMiterlimit(value: string) {
        if (value !== undefined && value !== null) {
            this.style.strokeMiterlimit = value;
        }
        return this;
    }

    public strokeOpacity(value: string) {
        if (value !== undefined && value !== null) {
            this.style.strokeOpacity = value;
        }
        return this;
    }

    public strokeWidth(value: string) {
        if (value !== undefined && value !== null) {
            this.style.strokeWidth = value;
        }
        return this;
    }

    public tableLayout(value: TableLayoutType) {
        if (value !== undefined && value !== null) {
            this.style.tableLayout = value;
        }
        return this;
    }

    public textAlign(value: TextAlignType) {
        if (value !== undefined && value !== null) {
            this.style.textAlign = value;
        }
        return this;
    }

    public textAlignLast(value: TextAlignLastType) {
        if (value !== undefined && value !== null) {
            this.style.textAlignLast = value;
        }
        return this;
    }

    public textAnchor(value: string) {
        if (value !== undefined && value !== null) {
            this.style.textAnchor = value;
        }
        return this;
    }

    public textCombineUpright(value: string) {
        if (value !== undefined && value !== null) {
            this.style.textCombineUpright = value;
        }
        return this;
    }

    public textDecoration(value: TextDecorationType) {
        if (value !== undefined && value !== null) {
            this.style.textDecoration = value;
        }
        return this;
    }

    public textIndent(value: string) {
        if (value !== undefined && value !== null) {
            this.style.textIndent = value;
        }
        return this;
    }

    public textJustify(value: JustifyType) {
        if (value !== undefined && value !== null) {
            this.style.textJustify = value;
        }
        return this;
    }

    public textKashida(value: string) {
        if (value !== undefined && value !== null) {
            this.style.textKashida = value;
        }
        return this;
    }

    public textKashidaSpace(value: string) {
        if (value !== undefined && value !== null) {
            this.style.textKashidaSpace = value;
        }
        return this;
    }

    public textOverflow(value: string) {
        if (value !== undefined && value !== null) {
            this.style.textOverflow = value;
        }
        return this;
    }

    public textShadow(value: string) {
        if (value !== undefined && value !== null) {
            this.style.textShadow = value;
        }
        return this;
    }

    public textTransform(value: TextTransformType) {
        if (value !== undefined && value !== null) {
            this.style.textTransform = value;
        }
        return this;
    }

    public textUnderlinePosition(value: string) {
        if (value !== undefined && value !== null) {
            this.style.textUnderlinePosition = value;
        }
        return this;
    }

    public top(value: number | string, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.top = toUnit(value, unit);
        }
        return this;
    }

    public touchAction(value: string) {
        if (value !== undefined && value !== null) {
            this.style.touchAction = value;
        }
        return this;
    }

    public transform(value: TransformType) {
        if (value !== undefined && value !== null) {
            this.style.transform = value;
        }
        return this;
    }

    public transformOrigin(value: string) {
        if (value !== undefined && value !== null) {
            this.style.transformOrigin = value;
        }
        return this;
    }

    public transformStyle(value: TransformStyleType) {
        if (value !== undefined && value !== null) {
            this.style.transformStyle = value;
        }
        return this;
    }

    public transition(value: string) {
        if (value !== undefined && value !== null) {
            this.style.transition = value;
        }
        return this;
    }

    public transitionDelay(value: string) {
        if (value !== undefined && value !== null) {
            this.style.transitionDelay = value;
        }
        return this;
    }

    public transitionDuration(value: string) {
        if (value !== undefined && value !== null) {
            this.style.transitionDuration = value;
        }
        return this;
    }

    public transitionProperty(value: string) {
        if (value !== undefined && value !== null) {
            this.style.transitionProperty = value;
        }
        return this;
    }

    public transitionTimingFunction(value: string) {
        if (value !== undefined && value !== null) {
            this.style.transitionTimingFunction = value;
        }
        return this;
    }

    public translate(value: string) {
        if (value !== undefined && value !== null) {
            this.style.translate = value;
        }
        return this;
    }

    public unicodeBidi(value: string) {
        if (value !== undefined && value !== null) {
            this.style.unicodeBidi = value;
        }
        return this;
    }

    public userSelect(value: string) {
        if (value !== undefined && value !== null) {
            this.style.userSelect = value;
        }
        return this;
    }

    public userDrag(value: string) {
        if (value !== undefined && value !== null) {
            this.style.userDrag = value;
        }
        return this;
    }

    public verticalAlign(value: string) {
        if (value !== undefined && value !== null) {
            this.style.verticalAlign = value;
        }
        return this;
    }

    public visibility(value: VisibilityType) {
        if (value !== undefined && value !== null) {
            this.style.visibility = value;
        }
        return this;
    }

    public webkitAlignContent(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAlignContent = value;
        }
        return this;
    }

    public webkitAlignItems(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAlignItems = value;
        }
        return this;
    }

    public webkitAlignSelf(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAlignSelf = value;
        }
        return this;
    }

    public webkitAnimation(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAnimation = value;
        }
        return this;
    }

    public webkitAnimationDelay(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAnimationDelay = value;
        }
        return this;
    }

    public webkitAnimationDirection(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAnimationDirection = value;
        }
        return this;
    }

    public webkitAnimationDuration(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAnimationDuration = value;
        }
        return this;
    }

    public webkitAnimationFillMode(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAnimationFillMode = value;
        }
        return this;
    }

    public webkitAnimationIterationCount(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAnimationIterationCount = value;
        }
        return this;
    }

    public webkitAnimationName(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAnimationName = value;
        }
        return this;
    }

    public webkitAnimationPlayState(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAnimationPlayState = value;
        }
        return this;
    }

    public webkitAnimationTimingFunction(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAnimationTimingFunction = value;
        }
        return this;
    }

    public webkitAppearance(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitAppearance = value;
        }
        return this;
    }

    public webkitBackfaceVisibility(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBackfaceVisibility = value;
        }
        return this;
    }

    public webkitBackgroundClip(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBackgroundClip = value;
        }
        return this;
    }

    public webkitBackgroundOrigin(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBackgroundOrigin = value;
        }
        return this;
    }

    public webkitBackgroundSize(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBackgroundSize = value;
        }
        return this;
    }

    public webkitBorderBottomLeftRadius(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBorderBottomLeftRadius = value;
        }
        return this;
    }

    public webkitBorderBottomRightRadius(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBorderBottomRightRadius = value;
        }
        return this;
    }

    public webkitBorderImage(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBorderImage = value;
        }
        return this;
    }

    public webkitBorderRadius(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBorderRadius = value;
        }
        return this;
    }

    public webkitBorderTopLeftRadius(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBorderTopLeftRadius = value;
        }
        return this;
    }

    public webkitBorderTopRightRadius(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBorderTopRightRadius = value;
        }
        return this;
    }

    public webkitBoxAlign(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBoxAlign = value;
        }
        return this;
    }

    public webkitBoxDirection(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBoxDirection = value;
        }
        return this;
    }

    public webkitBoxFlex(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBoxFlex = value;
        }
        return this;
    }

    public webkitBoxOrdinalGroup(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBoxOrdinalGroup = value;
        }
        return this;
    }

    public webkitBoxOrient(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBoxOrient = value;
        }
        return this;
    }

    public webkitBoxPack(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBoxPack = value;
        }
        return this;
    }

    public webkitBoxSizing(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitBoxSizing = value;
        }
        return this;
    }

    public webkitColumnBreakAfter(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitColumnBreakAfter = value;
        }
        return this;
    }

    public webkitColumnBreakBefore(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitColumnBreakBefore = value;
        }
        return this;
    }

    public webkitColumnBreakInside(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitColumnBreakInside = value;
        }
        return this;
    }

    public webkitColumnCount(value: any) {
        if (value !== undefined && value !== null) {
            this.style.webkitColumnCount = value;
        }
        return this;
    }

    public webkitColumnGap(value: any) {
        if (value !== undefined && value !== null) {
            this.style.webkitColumnGap = value;
        }
        return this;
    }

    public webkitColumnRule(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitColumnRule = value;
        }
        return this;
    }

    public webkitColumnRuleColor(value: any | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.webkitColumnRuleColor = value;
        }
        return this;
    }

    public webkitColumnRuleStyle(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitColumnRuleStyle = value;
        }
        return this;
    }

    public webkitColumnRuleWidth(value: any) {
        if (value !== undefined && value !== null) {
            this.style.webkitColumnRuleWidth = value;
        }
        return this;
    }

    public webkitColumnSpan(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitColumnSpan = value;
        }
        return this;
    }

    public webkitColumnWidth(value: any) {
        if (value !== undefined && value !== null) {
            this.style.webkitColumnWidth = value;
        }
        return this;
    }

    public webkitColumns(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitColumns = value;
        }
        return this;
    }

    public webkitFilter(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitFilter = value;
        }
        return this;
    }

    public webkitFlex(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitFlex = value;
        }
        return this;
    }

    public webkitFlexBasis(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitFlexBasis = value;
        }
        return this;
    }

    public webkitFlexDirection(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitFlexDirection = value;
        }
        return this;
    }

    public webkitFlexFlow(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitFlexFlow = value;
        }
        return this;
    }

    public webkitFlexGrow(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitFlexGrow = value;
        }
        return this;
    }

    public webkitFlexShrink(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitFlexShrink = value;
        }
        return this;
    }

    public webkitFlexWrap(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitFlexWrap = value;
        }
        return this;
    }

    public webkitJustifyContent(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitJustifyContent = value;
        }
        return this;
    }

    public webkitOrder(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitOrder = value;
        }
        return this;
    }

    public webkitPerspective(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitPerspective = value;
        }
        return this;
    }

    public webkitPerspectiveOrigin(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitPerspectiveOrigin = value;
        }
        return this;
    }

    public webkitTapHighlightColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.webkitTapHighlightColor = value;
        }
        return this;
    }

    public webkitTextFillColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.webkitTextFillColor = value;
        }
        return this;
    }

    public webkitTextSizeAdjust(value: any) {
        if (value !== undefined && value !== null) {
            this.style.webkitTextSizeAdjust = value;
        }
        return this;
    }

    public webkitTextStroke(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitTextStroke = value;
        }
        return this;
    }

    public webkitTextStrokeColor(value: string | ColorItem) {
        if (value !== undefined && value !== null) {
            this.style.webkitTextStrokeColor = value;
        }
        return this;
    }

    public webkitTextStrokeWidth(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitTextStrokeWidth = value;
        }
        return this;
    }

    public webkitTransform(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitTransform = value;
        }
        return this;
    }

    public webkitTransformOrigin(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitTransformOrigin = value;
        }
        return this;
    }

    public webkitTransformStyle(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitTransformStyle = value;
        }
        return this;
    }

    public webkitTransition(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitTransition = value;
        }
        return this;
    }

    public webkitTransitionDelay(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitTransitionDelay = value;
        }
        return this;
    }

    public webkitTransitionDuration(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitTransitionDuration = value;
        }
        return this;
    }

    public webkitTransitionProperty(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitTransitionProperty = value;
        }
        return this;
    }

    public webkitTransitionTimingFunction(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitTransitionTimingFunction = value;
        }
        return this;
    }

    public webkitUserModify(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitUserModify = value;
        }
        return this;
    }

    public webkitUserSelect(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitUserSelect = value;
        }
        return this;
    }

    public webkitUserDrag(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitUserDrag = value;
        }
        return this;
    }

    public webkitWritingMode(value: string) {
        if (value !== undefined && value !== null) {
            this.style.webkitWritingMode = value;
        }
        return this;
    }

    public whiteSpace(value: WhiteSpaceType) {
        if (value !== undefined && value !== null) {
            this.style.whiteSpace = value;
        }
        return this;
    }

    public widows(value: string) {
        if (value !== undefined && value !== null) {
            this.style.widows = value;
        }
        return this;
    }

    public width(value: string | number, unit: Units = "px") {
        if (value !== undefined && value !== null) {
            this.style.width = toUnit(value, unit);
        }
        return this;
    }

    public wordBreak(value: WordBreakType) {
        if (value !== undefined && value !== null) {
            this.style.wordBreak = value;
        }
        return this;
    }

    public wordSpacing(value: WordSpacingType) {
        if (value !== undefined && value !== null) {
            this.style.wordSpacing = value;
        }
        return this;
    }

    public wordWrap(value: WordWrapType) {
        if (value !== undefined && value !== null) {
            this.style.wordWrap = value;
        }
        return this;
    }

    public writingMode(value: string) {
        if (value !== undefined && value !== null) {
            this.style.writingMode = value;
        }
        return this;
    }

    public zIndex(value: string) {
        if (value !== undefined && value !== null) {
            this.style.zIndex = value;
        }
        return this;
    }

    public zoom(value: string) {
        if (value !== undefined && value !== null) {
            this.style.zoom = value;
        }
        return this;
    }

    public displayFlex() {
        this.style.display = "flex";
        return this;
    }

    public flexStretch() {
        return this.flex("1 1 100%");
    }

    public roundBorderFull() {
        this.style.borderRadius = "9999px";
        return this;
    }

    public subclass(name: string, style: IStyleDeclaration | AtomStyleRules) {
        if (style instanceof AtomStyleRules) {
            style = style.style;
        }
        const sc = this.style.subclasses ??= {};
        sc[name] = style;
        return this;
    }

    public childSubclass(name: string, style: IStyleDeclaration | AtomStyleRules) {
        return this.subclass(" > " + name, style);
    }

    public subclasses(... styles: AtomStyleRules[]) {
        const sc = this.style.subclasses ??= {};
        for (const iterator of styles) {
            sc[iterator.name] = iterator.style;
        }
        return this;
    }

    /**
     * Creates rule for immediate child like `this > child`
     * @param styles children
     * @returns this
     */
    public childSubclasses(... styles: AtomStyleRules[]) {
        const sc = this.style.subclasses ??= {};
        for (const iterator of styles) {
            sc[" > " + iterator.name] = iterator.style;
        }
        return this;
    }

    public roundBox(bgColor: string | ColorItem, padding: number = 5, radius: number = 5, unit: Units = "px") {
        this.style.padding = toUnit(padding, unit);
        this.style.borderRadius = toUnit(radius, unit);
        this.style.borderColor = bgColor;
        this.style.backgroundColor = bgColor;
        return this;
    }

    public maximizeAbsolute() {
        this.style.position = "absolute";
        this.style.left = 0;
        this.style.top = 0;
        this.style.bottom = 0;
        this.style.right = 0;
        return this;
    }

    public setRect(
        position: string,
        {
            top,
            left,
            right,
            bottom,
            width,
            height
        }: IRect = {},
        unit: Units = "px") {

        this.style.position = position;
        if (typeof top !== "undefined") {
            this.style.top = toUnit(top, unit);
        }
        if (typeof left !== "undefined") {
            this.style.left = toUnit(left, unit);
        }
        if (typeof width !== "undefined") {
            this.style.width = toUnit(width, unit);
        }
        if (typeof height !== "undefined") {
            this.style.height = toUnit(height, unit);
        }
        if (typeof right !== "undefined") {
            this.style.right = toUnit(right, unit);
        }
        if (typeof bottom !== "undefined") {
            this.style.bottom = toUnit(bottom, unit);
        }
        return this;
    }

    public absolutePosition(
        rect: IRect = {},
        unit: Units = "px") {
        return this.setRect("absolute", rect, unit);
    }

    public relativePosition(
        rect: IRect = {},
        unit: Units = "px") {
        return this.setRect("relative", rect, unit);
    }

    public absoluteDockTop(height: number | string, unit: Units = "px") {
        this.style.position = "absolute";
        this.style.left = 0;
        this.style.top = 0;
        this.style.right = 0;
        this.style.height = toUnit(height, unit);
        return this;
    }

    public absoluteDockBottom(top: number | string, unit: Units = "px") {
        this.style.position = "absolute";
        this.style.left = 0;
        this.style.bottom = 0;
        this.style.right = 0;
        this.style.top = toUnit(top, unit);
        return this;
    }

    public defaultBoxShadow() {
        this.style.boxShadow = "rgba(50, 50, 105, 0.07) 0px 2px 5px 0px, rgba(0, 0, 0, 0.03) 0px 1px 1px 0px;";
        this.style.border = "solid 1px rgba(0, 0, 0, 0.05)";
        return this;
    }

    public hover(style: AtomStyleRules) {
        const sc = this.style.subclasses ??= {};
        sc[":hover"] = { ... sc[":hover"], ... style.style };
        return this;
    }

    public hoverBackgroundColor(color: ColorItem | string) {
        const sc = this.style.subclasses ??= {};
        const hover = sc[":hover"] ??= {};
        hover.backgroundColor = color;
        return this;
    }

    public hoverColor(color: ColorItem | string) {
        const sc = this.style.subclasses ??= {};
        const hover = sc[":hover"] ??= {};
        hover.color = color;
        return this;
    }

    public and( ... styles: AtomStyleRules[]) {
        const sc = this.style.subclasses ??= {};
        for (const style of styles) {
            sc[style.name] = style.style;
        }
        return this;
    }

    public nested( ... styles: AtomStyleRules[]) {
        const sc = this.style.subclasses ??= {};
        for (const style of styles) {
            sc[" " + style.name] = style.style;
        }
        return this;
    }

    public child( ... styles: AtomStyleRules[]) {
        const sc = this.style.subclasses ??= {};
        for (const style of styles) {
            sc[" > " + style.name] = style.style;
        }
        return this;
    }

    public toStyleSheet() {
        const list = createStyleText(this.name, [], this.style);
        return list.join("\n");
    }

    public toggle(showSelector: string, hideSelector: string) {
        const sc = this.style.subclasses ??= {};
        const h = sc[hideSelector] ??= {};
        const d = sc[showSelector] ??= {};
        d.display = "initial";
        h.display = "none";
        return this;
    }

    /**
     * Creates vertical flex layout
     * @param p defaults { direction: "column", alignItems: "center", justifyContent: "center" }
     * @param units px
     */
     public verticalFlexLayout(a?: IFlexAttributes, units: Units = "px") {
        a.direction ??= "column";
        return this.flexLayout(a, units);
    }

    /**
     * Creates flex layout
     * @param p defaults { direction: "row", alignItems: "center", justifyContent: "center" }
     * @param units px
     */
    public flexLayout(
    {
        direction = "row",
        alignItems = "center",
        justifyContent = "space-around",
        stretch,
        inline,
        gap = 5
    }: IFlexAttributes = {},
    units: Units = "px") {
        if (direction !== void 0) {
            this.style.flexDirection = direction;
        }
        if (alignItems !== void 0) {
            this.style.alignItems = alignItems;
        }
        if (justifyContent !== void 0) {
            this.style.justifyContent = justifyContent;
        }
        if (stretch) {
            this.style.flex = "1 1 100%";
        }
        if (gap) {
            this.style.gap = toUnit(gap, units);
        }
        this.style.display = inline ? "inline-flex" : "flex";
    }

    public toString() {
        const list = [];
        if (this.style) {
            for (const key in this.style) {
                if (Object.prototype.hasOwnProperty.call(this.style, key)) {
                    const element = this.style[key];
                    if (key === "subclasses") {
                        throw new Error("Single AtomStyleRule cannot contain subclasses");
                    }
                    if (key === "toString") {
                        continue;
                    }
                    if (!element) {
                        continue;
                    }
                    const name = fromCamelToHyphen(key);
                    if (element.url) {
                        list.push(`${name}: url(${element.url})`);
                        continue;
                    }
                    list.push(`${name}: ${element}`);
                }
            }
        }
        return list.join(";");
    }
}

/**
 * Creates new style rule
 * @param selector [optional] name of child subclass
 * @returns StyleRuleClass
 */
function StyleRule(selector?: string): AtomStyleRules {
    return new AtomStyleRules(selector);
}

export default StyleRule;

const styleId = 1;

function fromCamelToHyphen(input: string): string {
    return input.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase();
}

function createStyleText(name: string, pairs: string[], styles: IStyleDeclaration): string[] {
    const styleList: any[] = [];
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
                        pairs = createStyleText(`${n}${subclassKey}`, pairs, ve);
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

    if (!name) {
        return [styleList.join(";")];
    }

    const cname = fromCamelToHyphen(name);

    const styleClassName = `${cname}`;

    if (styleList.length) {
        pairs.push(`.${styleClassName} { ${styleList.join(";\r\n")}; }`);
    }
    return pairs;
}
