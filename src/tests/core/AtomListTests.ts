import { AtomList } from "../../core/AtomList";
import { Assert } from "../../unit/Assert";
import { Test } from "../../unit/Test";
import { TestItem } from "../../unit/TestItem";

export class AtomListTest extends TestItem {

    @Test
    public remove(): void {
        const list = new AtomList();

        Assert.isFalse(list.remove(4));

        Assert.isFalse(list.remove((item) => 5));

        list.addAll([1, 2]);

        Assert.isFalse(list.remove(4));

        Assert.isFalse(list.remove((item) => item === 5));

        Assert.isTrue(list.remove(1));

        Assert.isTrue(list.remove((item) => item === 2));

        Assert.isEmpty(list.length);
    }

    @Test
    public insert(): void {
        const list = new AtomList();

        list.addAll([1, 2]);

        list.insert(1, 5);

        Assert.equals(5, list[1]);
    }
}
