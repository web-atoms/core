import { AtomList } from "../../core/AtomList";
import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";

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
    public removeMultiple(): void {
        const list = [1, 2, 3, 4, 5];

        // remove all even numbers...
        list.remove((x) => x <= 2);

        Assert.equals(3, list.length);
    }

    @Test
    public removeMultipleWithFirst(): void {
        const list = [1, 2, 3, 4, 5];

        // remove all even numbers...
        list.remove((x) => (x % 2) === 0);

        Assert.equals(3, list.length);
    }

    @Test
    public insert(): void {
        const list = new AtomList();

        list.addAll([1, 2]);

        list.insert(1, 5);

        Assert.equals(5, list[1]);
    }

    @Test
    public wrap(): void {
        const list = [1, 2];

        const d = list.watch((x) => {
            const a = x as [any, string, number, any];
            Assert.isTrue(typeof a[1] === "string");
        }, true);

        list.add(1);
    }

    @Test
    public replace(): void {

        const list = new AtomList<number>();

        list.add(2);

        const r = [1, 2];

        list.replace(r);

        Assert.equals(2, r.length);
    }

    @Test
    public replacePaging(): void  {
        const list = new AtomList<number>();

        const r = [1, 2] as any;
        r.total = 10;

        list.addAll(r);

        const a = [4, 5] as any;
        a.total = 10;

        list.replace(a, 2, 2);

        Assert.equals(2, list.start);
        Assert.equals(2, list.size);
        Assert.equals(10, list.total);

        list.next();

        Assert.equals(4, list.start);

        list.prev();

        Assert.equals(2, list.start);

        list.prev();

        Assert.equals(0, list.start);

        list.prev();

        Assert.equals(0, list.start);

        list.start = 0;

        list.size = 2;
    }
}
