import { ColorItem } from "../core/Colors.js";
import WebImage from "../core/WebImage.js";
import { IStyleDeclaration } from "../web/styles/IStyleDeclaration.js";

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
