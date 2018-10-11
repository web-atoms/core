import { AtomDisposableList } from "../../core/AtomDisposableList";
import { Assert } from "../../unit/Assert";
import { Test } from "../../unit/Test";
import { TestItem } from "../../unit/TestItem";

export class AtomDisposableListTest extends TestItem {

    @Test
    public test(): void {

        let b: boolean = false;
        let e: boolean = false;
        const d = new AtomDisposableList();
        d.add(() => {
            b = true;
        });
        d.add({
            dispose() {
                e = true;
            }
        });
        d.dispose();

        Assert.isTrue(b);

        Assert.isTrue(e);

    }

}
