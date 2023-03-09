import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";

const pair = (label, value) => ({ label, value });

export default class ArrayTests extends TestItem {

    @Test
    public groupBy() {
        const names = [
            pair("a", "a1"),
            pair("a", "a2"),
            pair("b", "b1"),
            pair("b", "b2"),
            pair("b", "b3"),
        ];

        const groups = names.groupBy((x) => x.label);
        Assert.equals(2, groups.length);
    }

}
