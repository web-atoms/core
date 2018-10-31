import { Assert } from "../../../unit/Assert";
import { AtomTest } from "../../../unit/AtomTest";
import { Test } from "../../../unit/Test";
import StyleBuilder from "../../../web/styles/StyleBuilder";

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
