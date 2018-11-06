import { AtomDisposableList } from "../../core/AtomDisposableList";
import AtomSelectableList from "../../core/AtomSelectableList";
import { Assert } from "../../unit/Assert";
import { AtomTest } from "../../unit/AtomTest";
import { Test } from "../../unit/Test";

export class AtomItemListTest extends AtomTest {

    @Test
    public syncItems(): void {

        const items = [1, 2, 3, 4, 5];

        const list = new AtomSelectableList();
        const a = items as any;
        a.total = 20;
        list.replace(items);
        list.value = 2;

        list.replace([4, 5, 6, 2]);

        Assert.equals(2, list.value);

        Assert.equals(3, list.selectedIndex);
    }

    @Test
    public singleItem(): void {
        const list = new AtomSelectableList();
        list.replace([1, 2, 3, 4, 5]);
        list.items[2].selected = true;

        Assert.equals(1, list.selectedItems.length);

        Assert.equals(3, list.value);
    }

    @Test
    public setValue(): void {
        const list = new AtomSelectableList();
        list.replace([1, 2, 3, 4, 5]);
        list.value = 3;

        Assert.equals(1, list.selectedItems.length);

        Assert.equals(3, list.value);
    }

    @Test
    public clearSelection(): void {
        const list = new AtomSelectableList();
        list.replace([1, 2, 3, 4]);
        list.value = 2;

        Assert.equals(1, list.selectedIndex);

        list.items[1].selected = false;

        Assert.equals(-1, list.selectedIndex);
    }

    @Test
    public reselect(): void {
        const list = new AtomSelectableList();
        list.replace([1, 2, 3]);
        list.value = 2;

        Assert.equals(1, list.selectedIndex);

        list.items[1].selected = true;
    }

    @Test
    public selectMultiple(): void {
        const list = new AtomSelectableList(true);
        list.replace([1, 2, 3, 4, 5]);
        list.items[1].selected = true;
        list.items[2].selected = true;

        Assert.equals(2, list.selectedItems.length);

        const v = list.value.join(", ");

        Assert.equals("2, 3", v);
    }

    @Test
    public selectMultipleValues(): void {
        const list = new AtomSelectableList(true);
        list.replace([1, 2, 3, 4, 5]);
        list.value = [2, 3];

        Assert.equals(2, list.selectedItems.length);

        const v = list.value.join(", ");

        Assert.equals("2, 3", v);
    }

    @Test
    public selectIndexMinusOne(): void {
        const list = new AtomSelectableList(false, (x) => x);
        list.value = 2;
        list.replace([1, 2, 3, 4]);

        Assert.equals(1, list.selectedIndex);

        list.selectedIndex = -1;

        Assert.equals(-1, list.selectedIndex);
        Assert.isUndefined(list.value);

        list.selectedIndex = 2;
        Assert.equals(3, list.value);
    }

    @Test
    public replaceMultipleSelectedValues(): void {
        const list = new AtomSelectableList<IKeyValue>(true, (x) => x.value);
        list.value = ["v2", "v3"];

        list.replace([
            { label: "l1", value: "v1" },
            { label: "l2", value: "v2" },
            { label: "l3", value: "v3" },
            { label: "l4", value: "v4" }
        ]);

        Assert.equals(2, list.selectedItems.length);
        Assert.equals("l2,l3", list.selectedItems.map((x) => x.item.label).sort().join(","));
    }
}

interface IKeyValue {
    label: string;
    value: string;
}
