import { AtomDisposableList } from "../../core/AtomDisposableList";
import AtomSelectableList from "../../core/AtomSelectableList";
import { Assert } from "../../unit/Assert";
import { AtomTest } from "../../unit/AtomTest";
import { Test } from "../../unit/Test";

export class AtomItemListTest extends AtomTest {

    @Test
    public singleItem(): void {
        const d = new AtomDisposableList();

        const list = new AtomSelectableList([1, 2, 3, 4, 5]);

        list.items[2].selected = true;

        Assert.equals(1, list.selectedItems.length);

        d.dispose();
    }

}
