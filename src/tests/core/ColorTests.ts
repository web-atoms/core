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

        let ci = new ColorItem(0, 255, 0);
        Assert.equals("#00ff00", ci.colorCode);

        ci = new ColorItem(0, 255, 0, 0);
        Assert.equals("rgba(0,255,0,0)", ci.colorCode);

    }

}
