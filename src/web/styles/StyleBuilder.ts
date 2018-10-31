import Color from "../../core/Color";
import { BorderStyleType, IStyleDeclaration } from "./IStyleDeclaration";

export type CssNumber = number | string;

export function cssNumberToString(n: CssNumber, unit: string = "px"): string {
    if (typeof n === "number") {
        if (n === 0) {
            return n + "";
        }

        return n + unit;
    }
    return n;

}

export default class StyleBuilder {

    public static get newStyle(): StyleBuilder {
        return new StyleBuilder();
    }

    private constructor(private style?: IStyleDeclaration) {
        this.style = this.style || {};
    }

    public toStyle(): IStyleDeclaration {
        return this.style;
    }

    public size(
        width: CssNumber,
        height: CssNumber
    ): StyleBuilder  {
        width = cssNumberToString(width);
        height = cssNumberToString(height);
        return this.merge({
            width,
            height
        });
    }

    public roundBorder(radius: CssNumber): StyleBuilder {
        radius = cssNumberToString(radius);
        return this.merge({
            borderRadius: radius,
            padding: radius
        });
    }

    public border(
        borderWidth: CssNumber,
        borderColor: Color,
        borderStyle: BorderStyleType = "solid"): StyleBuilder {
            borderWidth = cssNumberToString(borderWidth);
            return this.merge({
                borderWidth,
                borderStyle,
                borderColor
            });
        }

    public center(width: CssNumber, height: CssNumber): StyleBuilder {
        width = cssNumberToString(width);
        height = cssNumberToString(height);
        return this.merge({
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width,
            height,
            margin: "auto"
        });
    }

    public absolute(
        left: CssNumber,
        top: CssNumber,
        right?: CssNumber,
        bottom?: CssNumber): StyleBuilder {
        left = cssNumberToString(left);
        top = cssNumberToString(top);
        if (right !== undefined) {
            right = cssNumberToString(right);
            bottom = cssNumberToString(bottom);
            return this.merge ({
                position: "absolute",
                left,
                top,
                right,
                bottom
            });
        }
        return this.merge({
            position: "absolute",
            left,
            top
        });
    }

    private merge(style: IStyleDeclaration): StyleBuilder {
        return new StyleBuilder({
            ... this.style,
            ... style
        });
    }

}
