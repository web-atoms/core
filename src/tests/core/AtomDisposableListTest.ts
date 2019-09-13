import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";
import { AtomDisposableList } from "../../core/AtomDisposableList";

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
