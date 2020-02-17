import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import XNode, { RootObject } from "../../core/XNode";
import { AtomTest } from "../../unit/AtomTest";

const ns = XNode.namespace("A", "B");
@ns("C")
class C extends RootObject {

    public static p = XNode.property();

}

export default class JSXTest extends AtomTest {

    @Test
    public propertyTest() {
        const x = (C.p as any).factory();
        Assert.equals("A.C:p;B", x.name);
    }

}
