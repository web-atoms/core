import Assert from "@web-atoms/unit-test/dist/Assert.js";
import Test from "@web-atoms/unit-test/dist/Test.js";
import { AtomTest } from "../../../unit/AtomTest.js";
import StyleBuilder from "../../../web/styles/StyleBuilder.js";

export default class StyleBuilderTest extends AtomTest {

    @Test
    public size(): void {
        const s = StyleBuilder.newStyle
            .size(100, 100)
            .toStyle();
        Assert.equals("100px", s.width);
        Assert.equals("100px", s.height);
    }

    @Test
    public border(): void {
        //
    }

}
