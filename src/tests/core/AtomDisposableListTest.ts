import Assert from "@web-atoms/unit-test/dist/Assert.js";
import Test from "@web-atoms/unit-test/dist/Test.js";
import TestItem from "@web-atoms/unit-test/dist/TestItem.js";
import { AtomDisposableList } from "../../core/AtomDisposableList.js";

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
