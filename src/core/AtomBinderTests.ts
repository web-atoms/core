import { Assert } from "../unit/Assert";
import { Category } from "../unit/Category";
import { Test } from "../unit/Test";
import { TestItem } from "../unit/TestItem";
import { IWatchableObject } from "./AtomBinder";
import { AtomWatcher } from "./AtomWatcher";

interface ICustomer {
    firstName: string;
    lastName: string;
    name?: string;
}

@Category("Binder Tests")
export class TestCase extends TestItem {

    @Test()
    public plainObject(): void {
        const c: ICustomer = {
            firstName: "Akash",
            lastName: "Kava"
        };

        const bindable = c as IWatchableObject;
        let ba = bindable._$_bindable;

        Assert.isTrue(!ba);

        const w = new AtomWatcher(c, [["firstName"], ["lastName"]], true, false, (target, values) => {
            c.name = `${values[0]} ${values[1]}`;
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
