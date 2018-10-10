import Colors, { ColorItem } from "../../core/Colors";
import { IStyleDeclaration, StylePosition } from "./IStyleDeclaration";

export type CssNumber = number | string;

export default class Box {

    public static rect(
        left: CssNumber,
        top: CssNumber,
        right: CssNumber,
        bottom: CssNumber,
        position: StylePosition = "absolute"
    ): IStyleDeclaration {

        left = Box.toCssNumberString(left);
        top = Box.toCssNumberString(top);
        bottom = Box.toCssNumberString(bottom);
        right = Box.toCssNumberString(right);

        return {
            left,
            top,
            right,
            bottom,
            position
        };
    }

    public static absoluteRect(
        left: CssNumber,
        top: CssNumber,
        right: CssNumber,
        bottom: CssNumber): IStyleDeclaration {
        return Box.rect(left, top, right, bottom, "absolute");
    }

    public static box(width: CssNumber, height: CssNumber): IStyleDeclaration {
        if (typeof width === "number") {
            width = width + "px";
        }
        if (typeof height === "number") {
            height = height + "px";
        }
        return {
            width,
            height
        };
    }

    public static solidBorder(
        width: CssNumber,
        height: CssNumber,
        color: ColorItem = Colors.lightGray,
        borderWidth: CssNumber = 1,
        radius: CssNumber = 0 ): IStyleDeclaration {

        const box = Box.box(width, height);

        if (typeof borderWidth === "number") {
            borderWidth = borderWidth + "px";
        }

        let r: IStyleDeclaration = {};
        if (radius) {
            if (typeof radius === "number") {
                radius = radius + "px";
            }
            r = {
                borderRadius: radius,
                padding: radius
            };
        }
        return {
            ... r,
            borderWidth,
            borderStyle: "solid",
            borderColor: color
        };
    }

    private static toCssNumberString(n: CssNumber, suffix: string = "px"): string | number {
        if (typeof n === "number") {
            if (n === 0) {
                return n;
            }

            return n + suffix;
        }
        return n;
    }

}
