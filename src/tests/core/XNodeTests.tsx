import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";
import XNode from "../../core/XNode";
import { AtomItemsControl } from "../../web/controls/AtomItemsControl";

export default class XNodeTests extends TestItem {

    @Test
    public create() {

        const Button = (a, ... nodes) => <button {... a}>{ ... nodes}</button>;

        let node: XNode = <AtomItemsControl>
            <AtomItemsControl.itemTemplate>
                <div></div>
            </AtomItemsControl.itemTemplate>
        </AtomItemsControl>;
        Assert.equals(node.name, AtomItemsControl);
        Assert.equals(node.children[0].name, "itemTemplate");
        Assert.equals(node.children[0].isProperty, true);
        Assert.equals(node.children[0].isTemplate, true);

        node = <Button text="a"><div></div></Button>;
        Assert.equals(node.name, "button");
        Assert.equals(node.attributes.text, "a");
        Assert.equals(node.children[0].name, "div");

        node = <Button><div></div></Button>;
        Assert.equals(node.name, "button");
        Assert.equals(typeof node.attributes, "object");
        Assert.equals(node.children[0].name, "div");
    }

}
