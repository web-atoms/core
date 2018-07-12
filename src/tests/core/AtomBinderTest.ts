import { IWatchableObject } from "../../core/AtomBinder";
import { AtomList } from "../../core/AtomList";
import { AtomWatcher } from "../../core/AtomWatcher";
import { Assert } from "../../unit/Assert";
import { AtomTest } from "../../unit/AtomTest";
import { Test } from "../../unit/Test";

interface ICustomer {
    firstName: string;
    lastName: string;
    name?: string;
}

export class AtomBinderTest extends AtomTest {
    @Test
    public atomList(): void {

        const a = new AtomList();

        let modified = false;

        const d = a.watch(() => {
            modified = true;
        });

        a.add(1);

        Assert.isTrue(modified);

        modified = false;

        a.clear();

        Assert.isTrue(modified);

        a.add(4);
        a.add(5);

        modified = false;
        a.remove(5);

        Assert.isTrue(modified);

        d.dispose();
    }

    @Test
    public plainObject(): void {
        const c: ICustomer = {
            firstName: "Akash",
            lastName: "Kava"
        };

        const bindable = c as IWatchableObject;
        let ba = bindable._$_bindable;

        Assert.isTrue(!ba);

        const w = new AtomWatcher(c, [["firstName"], ["lastName"]], true, false, (firstName, lastName) => {
            c.name = `${firstName} ${lastName}`;
        });

        w.evaluate(true);

        Assert.equals("Akash Kava", c.name);

        ba =  bindable._$_bindable;
        Assert.isTrue(ba ? true : false);

        const i = ba.indexOf("firstName");
        Assert.doesNotEqual(-1, i);

        c.firstName = "Simmi";
        Assert.equals("Simmi Kava", c.name);
    }

}
