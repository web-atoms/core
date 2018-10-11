import Colors, { ColorItem } from "../../core/Colors";
import { Assert } from "../../unit/Assert";
import { Test } from "../../unit/Test";
import { TestItem } from "../../unit/TestItem";

export class TestCase extends TestItem {

    @Test
    public parse(): void {
        Assert.equals("#ff0000", Colors.red.colorCode);
        Assert.equals("#ff0000", Colors.parse("red").colorCode);
        Assert.equals("#ff0000", Colors.rgba(255, 0, 0).colorCode);
        Assert.equals("#ff0000", Colors.rgba(255, 0, 0).colorCode);
        Assert.equals("#ff0000", Colors.rgba(255, 0, 0).toString());

        let ci = new ColorItem(0, 255, 0);
        Assert.equals("#00ff00", ci.colorCode);

        ci = new ColorItem(0, 255, 0, 0);
        Assert.equals("rgba(0,255,0,0)", ci.colorCode);

        ci = new ColorItem(0, 255, 0, 0.5);
        Assert.equals("rgba(0,255,0,0.5)", ci.colorCode);

        const r = Colors.parse("#ff0000");
        Assert.equals(255, r.red);
        Assert.equals(0, r.green);
        Assert.equals(0, r.blue);

        const white = Colors.parse("#fff");
        Assert.equals(255, white.red);
        Assert.equals(255, white.blue);
        Assert.equals(255, white.green);

        const whiteWithAlpha = Colors.parse("#ff0000ff");
        Assert.equals(255, whiteWithAlpha.red);
        Assert.equals(0, whiteWithAlpha.green);
        Assert.equals(0, whiteWithAlpha.blue);

        const rgba = Colors.parse("rgba(100,200,255,0.5)");
        Assert.equals(100, rgba.red);
        Assert.equals(200, rgba.green);
        Assert.equals(255, rgba.blue);
        Assert.equals(0.5, rgba.alpha);

        const rgba1 = rgba.withAlphaPercent(0.2);
        Assert.equals(0.2, rgba1.alpha);

        const rgb = Colors.parse("rgb(100,200,255)");
        Assert.equals(100, rgb.red);
        Assert.equals(200, rgb.green);
        Assert.equals(255, rgb.blue);

        Assert.throws("Invalid color format aaa", () => Colors.parse("aaa"));

        Assert.throws("Unknown color format aaa", () => new ColorItem("aaa"));
    }

}
