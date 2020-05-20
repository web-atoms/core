import { ColorItem } from "../../core/Colors";
import WebImage from "../../core/WebImage";

export type StylePosition = "" | "default" | "initial" | "static" | "relative" | "absolute" | string | null;
export type TextAlignType = "" | "default" | "initial" | "left" | "right" | "center" | "justify" | string | null;
export type FloatPosition = "" | "default" | "none" | "left" | "right" | "initial" | "inherit" | string | null;
export type OverFlowType = "" | "default" | "visible" | "hidden" | "scroll" | "auto" | string | null;
export type ItemAlignType =  "" | "default" | "stretch" | "center" |"flex-start" | "flex-end" | "baseline" |
"initial" | "inherit" | string | null;
export type SelfAlignType =  "" | "default" | "auto" | "stretch" | "center" |"flex-start" | "flex-end" | "baseline" |
"initial" | "inherit" | string | null;
export type ContentAlignType =  "" | "default" | "stretch" | "center" |"flex-start" | "flex-end" | "space-between" |
"space-around" | "initial" | "inherit" | string | null;
export type JustifyType = "" | "default" | "auto" | "inter-word" | "inter-character" | "none" | "initial" |
"inherit" | string | null;
export type TextSize = "" | "default" | "medium" | "xx-small" | "x-small" | "small" | "large" |
"x-large" | "xx-large" | "smaller" | "larger" | "initial" | "inherit" | string | null;
export type AnimationType = "" | "animation-name" | "animation-duration" | "animation-timing-function" |
"animation-delay" | "animation-iteration-count" | "animation-direction" |"animation-fill-mode" |
"animation-play-state" | "initial" | "inherit" | string | null;
export type AnimationNameType = "" | "keyframename" | "none" | "initial" | "inherit" | string | null;
export type AnimationDirection = "" | "default" | "reverse" | "alternate" | "alternate-reverse" | "initial" |
"inherit" | string | null;
export type AnimationTimeType = "" | "initial" | "inherit" | string | null;
export type AnimationModeType = "" | "default" | "none" | "forwards" | "backwards" | "both" | "initial" |
"inherit" | string | null;
export type IterationCount = "" | "default" | "infinite" | "initial" |"inherit" | string | null;
export type PlayState = "" | "default" | "paused" | "running" | "initial" | "inherit" | string | null;
export type TimingFunction = "" | "default" | "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" |
"step-start" | "step-end" | "steps()" | "cubic-bezier()" | "initial" | "inherit" | string | null;
export type Visibility = "" | "default" | "visible" | "hidden" | "initial" | "inherit" | string | null;
export type BackgroundType = "" | "background-color" | "background-image" | "background-position" |
"background-size" | "background-repeat" | "background-origin" |"background-clip" | "background-attachment" |
"initial" | "inherit" | string | null;
export type BackgroundAttachmentType = "" | "default" | "scroll" | "fixed" | "local" |"initial" | "inherit" |
string | null;
export type BackgroundBlendType = "" | "default" | "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" |
"color-dodge" | "saturation" | "color" | "luminosity" |"initial" | "inherit" | string | null;
export type BackgroundClipType = "" | "default" | "border-box" | "padding-box" | "content-box" |"initial" |
"inherit" | string | null;
export type BackgroundImageType = "" | "default" | "url()" | "none" | "linear-gradient()" |"radial-gradient()" |
"repeating-linear-gradient()" | "repeating-radial-gradient()" | "initial" | "inherit" | string | null;
export type BackgroundOriginType = "" | "default" | "padding-box" | "border-box" | "content-box" |"initial" |
"inherit" | string | null;
export type BackgroundPositionType = "" | "default" | "left top" | "left center" | "left bottom" |"right top" |
"right center" | "right bottom" | "center top" | "center center" | "center bottom" | "0% 0%" | "0px 0px" |
"initial" | "inherit" | string | null;
export type BackgroundRepeatType = "" | "default" | "repeat" | "repeat-x" | "repeat-y" | "no-repeat" | "space" |
"round" |"initial" | "inherit" | string | null;
export type BackgroundSizeType = "" | "default" | "auto" | "0px" | "0px 0px" | "0%" | "50% 50%" | "cover" |
"contain" |"initial" | "inherit" | string | null;
export type BorderStyleType = "" | "default" | "none" | "hidden" | "dotted" | "dashed" | "solid" | "double" |
"groove" | "ridge" | "inset" | "outset" | "initial" | "inherit" | string | null;
export type CommamWidthType = "" | "default" | "medium" | "thin" | "thick" | "initial" | "inherit" | string | null;
export type BorderCollapseType = "" | "default" | "separate" | "collapse" | "initial" | "inherit" | string | null;
export type BorderImageRepeatType = "" | "default" | "stretch" | "repeat" | "round" | "space" | "initial" |
"inherit" | string | null;
// export type BorderRadiusType = "" | "default" | "0px" | "0px 0px" | "0px 0px 0px" | "0px 0px 0px" | "0%" |
// "initial" | "inherit" | string | null;
export type BorderSpacingType = "" | "default" | "0px" | "0px 0px" | "initial" | "inherit" | null | string;
export type PositionType = "" | "default" | "auto" | "50px" | "-50px" | "50%" | "-50%" |"initial" | "inherit"
| null | string | number;
export type BoxSizingType = "" | "default" | "border-box" | "content-box" |"initial" | "inherit" | string | null;
export type CaptionSideType = "" | "default" | "top" | "bottom" | "initial" | "inherit" | string | null;
export type ClearType = "" | "default" | "none" | "left" |"right" | "both" | "initial" | "inherit" | string | null;
export type ColumnCountType = "" | "default" | "auto" | "initial" | "inherit" | string | null | number;
export type ColumnGapType = "" | "default" | "normal" | "initial" | "inherit" | string | null;
export type ContentType = "" | "default" | "none" | "normal" | "counter" | "attr()" | "open-quote" | "close-quote" |
"no-open-quote" | "no-close-quote" | "url()" | "initial" | "inherit" | string | null;
export type CursorType = "" | "alias" | "all-scroll" | "auto" | "cell" |"context-menu" |"col-resize" | "copy" |
"crosshair" | "default" | "e-resize" | "ew-resize" | "grab" | "grabbing" |"help" |"move" | "n-resize" | "ne-resize" |
"nesw-resize" | "ns-resize" | "nw-resize" | "nwse-resize" | "no-drop" | "none" | "not-allowed" | "pointer" |
"progress" | "row-resize" | "s-resize" | "se-resize" | "sw-resize" | "text" | "url()" | "vertical-text" | "w-resize" |
"wait" | "zoom-in" | "zoom-out" |"initial" | "inherit" | string | null;
export type DirectionType = "" | "default" | "ltr" | "rtl" | "initial" | "inherit" | string | null;
export type DisplayType = "" | "default" | "inline" | "block" | "contents" |"flex" | "grid" | "inline-block" |
"inline-flex" | "inline-grid" | "inline-table" | "list-item" | "run-in" | "table" | "table-caption" |
"table-column-group" | "table-header-group" | "table-footer-group" | "table-row-group" | "table-cell" |
"table-column" | "table-row" | "none" | "none" | "initial" | "inherit" | string | null;
export type EmptyCellType = "" | "default" | "show" | "hide" | "initial" | "inherit" | string | null;
export type FilterType = "" | "none" | "blur()" | "brightness()" | "contrast()" | "drop-shadow()" | "grayscale()" |
"hue-rotate()" | "invert()" | "opacity()" | "saturate()" | "sepia()" | "url()" | "initial" | "inherit" | string | null;
export type FlexDirectionType = "" | "default" | "row" | "row-reverse" | "column" | "column-reverse" |
"initial" | "inherit" | string | null;
export type FlexFlowDirectionType = "" | "default" | "column" | "column-reverse" | "nowrap" | "row" | "row-reverse" |
"unset" | "wrap" | "wrap-reverse" |"initial" | "inherit" | string | null;
export type FlexWrapType = "" | "default" | "nowrap" | "wrap" | "wrap-reverse" | "initial" | "inherit" | string | null;
export type FloatType = "" | "default" | "none" | "left" | "right" | "initial" | "inherit" | string | null;
export type FontStretchType = "" | "default" | "ultra-condensed" | "extra-condensed" | "condensed" | "semi-condensed" |
"normal" | "semi-expanded" | "expanded" | "extra-expanded" | "ultra-expanded" | "initial" | "inherit" | string | null;
export type FontStyleType = "" | "default" | "normal" | "italic" | "oblique" | "initial" | "inherit" | string | null;
export type FontVariantType = "" | "default" | "normal" | "small-caps" | "initial" | "inherit" | string | null;
export type FontWeightType = "" | "default" | "normal" | "bold" | "bolder" | "lighter" | "initial" | "inherit" |
string | null;
export type GridAutoColumnsType = "" | "default" | "auto" | "max-content" | "min-content" | string | null;
export type GridAutoFlowType = "" | "default" | "row" | "column" | "row dense" | "column dense" | string | null;
export type GridAutoRowsType = "" | "default" | "auto" | "max-content" | "min-content" | string | null;
export type JustifyContentType = "" | "default" | "flex-start" | "flex-end" | "center" | "space-between" |
"space-around" | "initial" | "inherit" | string | null;
export type ListStylePositionType = "" | "default" | "inside" | "max-content" | "outside" | "initial" |
"inherit" | string | null;
export type ListStyleType = "" | "default" | "disc" | "circle" | "none" | "square" | string | null;
export type ObjectFitType = "" | "default" | "fill" | "contain" | "cover" | "none" | "scale-down" |
"initial" | "inherit" | string | null;
export type ObjectPositionType = "" | "default" | "fill" | "contain" | "cover" | "none" | "scale-down" |
"initial" | "inherit" | string | null;
export type PageBreakCommanType = "" | "default" | "auto" | "always" | "avoid" | "left" | "right" |
"initial" | "inherit" | string | null;
export type PageBreakInsideType = "" | "default" | "auto"| "avoid" | "initial" | "inherit" | string | null;
export type ResizeType = "" | "default" | "none" | "both" | "horizontal" | "vertical" | "initial" |
"inherit" | string | null;
export type TableLayoutType = "" | "default" | "auto" | "fixed" | "initial" | "inherit" | string | null;
export type TextAlignLastType = "" | "default" | "auto" | "left" | "right" | "center" | "justify" |
"start" | "end" | "initial" | "inherit"| string | null;
export type TextDecorationType = "" | "none" | "underline" | "overline" | "line-through" |
"initial" | "inherit" | string | null;
export type TextTransformType = "" | "none" | "capitalize" | "uppercase" | "lowercase" | "initial" |
"inherit" | string | null;
export type TransformType = "" | "default" | "none" | "matrix()" | "matrix3d()" | "translate()" | "translate3d()" |
"translateX()" | "translateY()" | "translateZ()" | "scale()" | "scale3d()" | "scaleX()" | "scaleY()" | "scaleZ()" |
"rotate()" | "rotate3d()" | "rotateX()" | "rotateY()" | "rotateZ()" | "skew()" | "skewX()" | "skewY()" |
"perspective()" | "initial" | "inherit" | string | null;
export type TransformStyleType = "" | "default" | "flat" | "preserve-3d" | "initial" | "inherit" | string | null;
export type VisibilityType = "" | "default" | "visible" | "hidden" | "collapse" | "initial" | "inherit" | string | null;
export type WhiteSpaceType = "" | "default" | "normal" | "nowrap" | "pre" | "pre-line" | "pre-wrap" |
"initial" | "inherit" | string | null;
export type WordBreakType = "" | "default" | "normal" | "break-all" | "keep-all" | "break-word" |
"initial" | "inherit" | string | null;
export type WordSpacingType = "" | "default" | "normal" | "initial" | "inherit" | string | null;
export type WordWrapType = "" | "default" | "normal" | "break-word" | "initial" | "inherit" | string | null;
export interface IStyleDeclaration {
    alignContent?: ContentAlignType;
    alignItems?: ItemAlignType;
    alignSelf?: SelfAlignType;
    alignmentBaseline?: string | null;
    animation?: AnimationType;
    animationDelay?: AnimationTimeType;
    animationDirection?: AnimationDirection;
    animationDuration?: AnimationTimeType;
    animationFillMode?: AnimationModeType;
    animationIterationCount?: IterationCount;
    animationName?: AnimationNameType;
    animationPlayState?: PlayState;
    animationTimingFunction?: TimingFunction;
    backfaceVisibility?: Visibility;
    background?: BackgroundType;
    backgroundAttachment?: BackgroundAttachmentType;
    backgroundBlendMode?: BackgroundBlendType;
    backgroundClip?: BackgroundClipType;
    backgroundColor?: string | null | ColorItem;
    backgroundImage?: string | null | WebImage;
    backgroundOrigin?: BackgroundOriginType;
    backgroundPosition?: BackgroundPositionType;
    backgroundPositionX?: string | null;
    backgroundPositionY?: string | null;
    backgroundRepeat?: BackgroundRepeatType;
    backgroundSize?: BackgroundSizeType;
    baselineShift?: string | null;
    border?: string | null;
    borderBottom?: string | null;
    borderBottomColor?: string | null | ColorItem;
    borderBottomLeftRadius?: string | 0 | null;
    borderBottomRightRadius?: string | 0 | null;
    borderBottomStyle?: BorderStyleType;
    borderBottomWidth?: CommamWidthType;
    borderCollapse?: BorderCollapseType;
    borderColor?: string | null | ColorItem;
    borderImage?: string | null;
    borderImageOutset?: string | null;
    borderImageRepeat?: BorderImageRepeatType;
    borderImageSlice?: string | null;
    borderImageSource?: string | null;
    borderImageWidth?: string | null;
    borderLeft?: string | null;
    borderLeftColor?: string | null | ColorItem;
    borderLeftStyle?: BorderStyleType;
    borderLeftWidth?: CommamWidthType;
    borderRadius?: string | 0 | null;
    borderRight?: string | null;
    borderRightColor?: string | null | ColorItem;
    borderRightStyle?: BorderStyleType;
    borderRightWidth?: CommamWidthType;
    borderSpacing?: BorderSpacingType;
    borderStyle?: BorderStyleType;
    borderTop?: string | null;
    borderTopColor?: string | null | ColorItem;
    borderTopLeftRadius?: string | 0 | null;
    borderTopRightRadius?: string | 0 | null;
    borderTopStyle?: BorderStyleType;
    borderTopWidth?: CommamWidthType;
    borderWidth?: CommamWidthType;
    bottom?: PositionType;
    boxShadow?: string | null;
    boxSizing?: BoxSizingType;
    breakAfter?: string | null;
    breakBefore?: string | null;
    breakInside?: string | null;
    captionSide?: CaptionSideType;
    /**
     * Warning, do not use this
     */
    className?: string;
    clear?: ClearType;
    clip?: string | null;
    clipPath?: string | null;
    clipRule?: string | null;
    color?: string | null | ColorItem;
    colorInterpolationFilters?: string | null;
    columnCount?: any;
    columnFill?: string | null;
    columnGap?: ColumnGapType;
    columnRule?: string | null;
    columnRuleColor?: any | ColorItem;
    columnRuleStyle?: BorderStyleType;
    columnRuleWidth?: CommamWidthType;
    columnSpan?: string | null;
    columnWidth?: any;
    columns?: string | null;
    content?: ContentType;
    counterIncrement?: string | null;
    counterReset?: string | null;
    cssFloat?: FloatPosition;
    cssText?: string;
    cursor?: CursorType;
    direction?: DirectionType;
    display?: DisplayType;
    dominantBaseline?: string | null;
    emptyCells?: EmptyCellType;
    enableBackground?: string | null;
    fill?: string | null;
    fillOpacity?: string | null;
    fillRule?: string | null;
    filter?: FilterType;
    flex?: string | null;
    flexBasis?: string | null;
    flexDirection?: FlexDirectionType;
    flexFlow?: FlexFlowDirectionType;
    flexGrow?: string | null;
    flexShrink?: string | null;
    flexWrap?: FlexWrapType;
    float?: FloatType;
    floodColor?: string | null | ColorItem;
    floodOpacity?: string | null;
    font?: string | null;
    fontFamily?: string | null;
    fontFeatureSettings?: string | null;
    fontSize?: TextSize;
    fontSizeAdjust?: string | null;
    fontStretch?: FontStretchType;
    fontStyle?: FontStyleType;
    fontVariant?: FontVariantType;
    fontWeight?: FontWeightType;
    gap?: string | null;
    glyphOrientationHorizontal?: string | null;
    glyphOrientationVertical?: string | null;
    grid?: string | null;
    gridArea?: string | null;
    gridAutoColumns?: GridAutoColumnsType;
    gridAutoFlow?: GridAutoFlowType;
    gridAutoRows?: GridAutoRowsType;
    gridColumn?: string | null;
    gridColumnEnd?: string | null;
    gridColumnGap?: string | null;
    gridColumnStart?: string | null;
    gridGap?: string | null;
    gridRow?: string | null;
    gridRowEnd?: string | null;
    gridRowGap?: string | null;
    gridRowStart?: string | null;
    gridTemplate?: string | null;
    gridTemplateAreas?: string | null;
    gridTemplateColumns?: string | null;
    gridTemplateRows?: string | null;
    height?: string | null;
    imeMode?: string | null;
    justifyContent?: JustifyContentType;
    justifyItems?: string | null;
    justifySelf?: string | null;
    kerning?: string | null;
    layoutGrid?: string | null;
    layoutGridChar?: string | null;
    layoutGridLine?: string | null;
    layoutGridMode?: string | null;
    layoutGridType?: string | null;
    left?: PositionType;
    readonly length?: number;
    letterSpacing?: string | null;
    lightingColor?: string | null | ColorItem;
    lineBreak?: string | null;
    lineHeight?: string | null;
    listStyle?: string | null;
    listStyleImage?: string | null;
    listStylePosition?: ListStylePositionType;
    listStyleType?: ListStyleType;
    margin?: number | string | null;
    marginBottom?: number | string | null;
    marginLeft?: number | string | null;
    marginRight?: number | string | null;
    marginTop?: number | string | null;
    marginInlineStart?: number | string | null;
    marginInlineEnd?: number | string | null;
    marginBlockStart?: number | string | null;
    marginBlockEnd?: number | string | null;
    marker?: string | null;
    markerEnd?: string | null;
    markerMid?: string | null;
    markerStart?: string | null;
    mask?: string | null;
    maskImage?: string | null;
    maxHeight?: string | null;
    maxWidth?: string | null;
    minHeight?: string | null;
    minWidth?: string | null;
    msContentZoomChaining?: string | null;
    msContentZoomLimit?: string | null;
    msContentZoomLimitMax?: any;
    msContentZoomLimitMin?: any;
    msContentZoomSnap?: string | null;
    msContentZoomSnapPoints?: string | null;
    msContentZoomSnapType?: string | null;
    msContentZooming?: string | null;
    msFlowFrom?: string | null;
    msFlowInto?: string | null;
    msFontFeatureSettings?: string | null;
    msGridColumn?: any;
    msGridColumnAlign?: string | null;
    msGridColumnSpan?: any;
    msGridColumns?: string | null;
    msGridRow?: any;
    msGridRowAlign?: string | null;
    msGridRowSpan?: any;
    msGridRows?: string | null;
    msHighContrastAdjust?: string | null;
    msHyphenateLimitChars?: string | null;
    msHyphenateLimitLines?: any;
    msHyphenateLimitZone?: any;
    msHyphens?: string | null;
    msImeAlign?: string | null;
    msOverflowStyle?: string | null;
    msScrollChaining?: string | null;
    msScrollLimit?: string | null;
    msScrollLimitXMax?: any;
    msScrollLimitXMin?: any;
    msScrollLimitYMax?: any;
    msScrollLimitYMin?: any;
    msScrollRails?: string | null;
    msScrollSnapPointsX?: string | null;
    msScrollSnapPointsY?: string | null;
    msScrollSnapType?: string | null;
    msScrollSnapX?: string | null;
    msScrollSnapY?: string | null;
    msScrollTranslation?: string | null;
    msTextCombineHorizontal?: string | null;
    msTextSizeAdjust?: any;
    msTouchAction?: string | null;
    msTouchSelect?: string | null;
    msUserSelect?: string | null;
    msWrapFlow?: string;
    msWrapMargin?: any;
    msWrapThrough?: string;
    objectFit?: ObjectFitType;
    objectPosition?: ObjectPositionType;
    opacity?: string | null;
    order?: string | null;
    orphans?: string | null;
    outline?: string | null;
    outlineColor?: string | null | ColorItem;
    outlineOffset?: string | null;
    outlineStyle?: BorderStyleType;
    outlineWidth?: CommamWidthType;
    overflow?: OverFlowType;
    overflowX?: OverFlowType;
    overflowY?: OverFlowType;
    padding?: number | string | null;
    paddingBottom?: number | string | null;
    paddingLeft?: number | string | null;
    paddingRight?: number | string | null;
    paddingTop?: number | string | null;
    paddingInlineStart?: number | string | null;
    paddingInlineEnd?: number | string | null;
    pageBreakAfter?: PageBreakCommanType;
    pageBreakBefore?: PageBreakCommanType;
    pageBreakInside?: PageBreakInsideType;
    readonly parentRule?: CSSRule;
    penAction?: string | null;
    perspective?: string | null;
    perspectiveOrigin?: string | null;
    pointerEvents?: string | null;
    position?: StylePosition;
    quotes?: string | null;
    resize?: ResizeType;
    right?: PositionType;
    rotate?: string | null;
    rowGap?: string | null;
    rubyAlign?: string | null;
    rubyOverhang?: string | null;
    rubyPosition?: string | null;
    scale?: string | null;
    stopColor?: string | null | ColorItem;
    stopOpacity?: string | null;
    stroke?: string | null;
    strokeDasharray?: string | null;
    strokeDashoffset?: string | null;
    strokeLinecap?: string | null;
    strokeLinejoin?: string | null;
    strokeMiterlimit?: string | null;
    strokeOpacity?: string | null;
    strokeWidth?: string | null;
    tableLayout?: TableLayoutType;
    textAlign?: TextAlignType;
    textAlignLast?: TextAlignLastType;
    textAnchor?: string | null;
    textCombineUpright?: string | null;
    textDecoration?: TextDecorationType;
    textIndent?: string | null;
    textJustify?: JustifyType;
    textKashida?: string | null;
    textKashidaSpace?: string | null;
    textOverflow?: string | null;
    textShadow?: string | null;
    textTransform?: TextTransformType;
    textUnderlinePosition?: string | null;
    top?: PositionType;
    touchAction?: string | null;
    transform?: TransformType;
    transformOrigin?: string | null;
    transformStyle?: TransformStyleType;
    transition?: string | null;
    transitionDelay?: string | null;
    transitionDuration?: string | null;
    transitionProperty?: string | null;
    transitionTimingFunction?: string | null;
    translate?: string | null;
    unicodeBidi?: string | null;
    userSelect?: string | null;
    verticalAlign?: string | null;
    visibility?: VisibilityType;
    webkitAlignContent?: string | null;
    webkitAlignItems?: string | null;
    webkitAlignSelf?: string | null;
    webkitAnimation?: string | null;
    webkitAnimationDelay?: string | null;
    webkitAnimationDirection?: string | null;
    webkitAnimationDuration?: string | null;
    webkitAnimationFillMode?: string | null;
    webkitAnimationIterationCount?: string | null;
    webkitAnimationName?: string | null;
    webkitAnimationPlayState?: string | null;
    webkitAnimationTimingFunction?: string | null;
    webkitAppearance?: string | null;
    webkitBackfaceVisibility?: string | null;
    webkitBackgroundClip?: string | null;
    webkitBackgroundOrigin?: string | null;
    webkitBackgroundSize?: string | null;
    webkitBorderBottomLeftRadius?: string | null;
    webkitBorderBottomRightRadius?: string | null;
    webkitBorderImage?: string | null;
    webkitBorderRadius?: string | null;
    webkitBorderTopLeftRadius?: string | null;
    webkitBorderTopRightRadius?: string | null;
    webkitBoxAlign?: string | null;
    webkitBoxDirection?: string | null;
    webkitBoxFlex?: string | null;
    webkitBoxOrdinalGroup?: string | null;
    webkitBoxOrient?: string | null;
    webkitBoxPack?: string | null;
    webkitBoxSizing?: string | null;
    webkitColumnBreakAfter?: string | null;
    webkitColumnBreakBefore?: string | null;
    webkitColumnBreakInside?: string | null;
    webkitColumnCount?: any;
    webkitColumnGap?: any;
    webkitColumnRule?: string | null;
    webkitColumnRuleColor?: any | ColorItem;
    webkitColumnRuleStyle?: string | null;
    webkitColumnRuleWidth?: any;
    webkitColumnSpan?: string | null;
    webkitColumnWidth?: any;
    webkitColumns?: string | null;
    webkitFilter?: string | null;
    webkitFlex?: string | null;
    webkitFlexBasis?: string | null;
    webkitFlexDirection?: string | null;
    webkitFlexFlow?: string | null;
    webkitFlexGrow?: string | null;
    webkitFlexShrink?: string | null;
    webkitFlexWrap?: string | null;
    webkitJustifyContent?: string | null;
    webkitOrder?: string | null;
    webkitPerspective?: string | null;
    webkitPerspectiveOrigin?: string | null;
    webkitTapHighlightColor?: string | null | ColorItem;
    webkitTextFillColor?: string | null | ColorItem;
    webkitTextSizeAdjust?: any;
    webkitTextStroke?: string | null;
    webkitTextStrokeColor?: string | null | ColorItem;
    webkitTextStrokeWidth?: string | null;
    webkitTransform?: string | null;
    webkitTransformOrigin?: string | null;
    webkitTransformStyle?: string | null;
    webkitTransition?: string | null;
    webkitTransitionDelay?: string | null;
    webkitTransitionDuration?: string | null;
    webkitTransitionProperty?: string | null;
    webkitTransitionTimingFunction?: string | null;
    webkitUserModify?: string | null;
    webkitUserSelect?: string | null;
    webkitWritingMode?: string | null;
    whiteSpace?: WhiteSpaceType;
    widows?: string | null;
    width?: string | null;
    wordBreak?: WordBreakType;
    wordSpacing?: WordSpacingType;
    wordWrap?: WordWrapType;
    writingMode?: string | null;
    zIndex?: string | null;
    zoom?: string | null;

    // [key: string]: any | IStyleDeclaration;

    subclasses?: { [key: string]: IStyleDeclaration };

}
