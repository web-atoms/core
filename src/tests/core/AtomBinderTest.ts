import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import { AtomBinder, IWatchableObject } from "../../core/AtomBinder";
import { AtomList } from "../../core/AtomList";
import { AtomWatcher } from "../../core/AtomWatcher";
import { AtomTest } from "../../unit/AtomTest";
import { AtomButtonStyle } from "../../web/styles/AtomButtonStyle";

interface ICustomer {
    firstName: string;
    lastName: string;
    name?: string;
    time?: number;
}

export class AtomBinderTest extends AtomTest {

    @Test
    public refreshValue(): void {
        AtomBinder.refreshValue(undefined, "key");
        AtomBinder.refreshValue(null, "key");
    }

    @Test
    public emptyReturns(): void {
        AtomBinder.add_WatchHandler(null, "", null);
        AtomBinder.invokeItemsEvent([], "", 0, {});
        AtomBinder.remove_WatchHandler(null, "", null);
        AtomBinder.remove_WatchHandler({}, "a", null);

        // tslint:disable-next-line: no-empty
        const f = () => {};
        const a = {};
        AtomBinder.add_WatchHandler(a, "a", f);
        AtomBinder.remove_WatchHandler(a, "b", f);
        AtomBinder.remove_WatchHandler(a, "a", f);

        AtomBinder.remove_CollectionChanged(null, null);
        AtomBinder.remove_CollectionChanged([], null);

        const ar = [];
        AtomBinder.invokeItemsEvent(null, "", 0, {});
        AtomBinder.add_WatchHandler(ar, "length", f);
        AtomBinder.invokeItemsEvent(ar, "", 0, {});
        AtomBinder.remove_CollectionChanged(ar, null);
    }

    @Test
    public nullExceptions(): void {
        Assert.throws("Target Array to watch cannot be null", () =>
            AtomBinder.add_CollectionChanged(null, null));
        Assert.throws("Target handle to watch an Array cannot be null", () =>
            AtomBinder.add_CollectionChanged([], null));
    }

    @Test
    public clear(): void {
        const a = [1, 2];
        AtomBinder.clear(a);
        Assert.equals(0, a.length);

        AtomBinder.addItem(a, 1);
        Assert.equals(1, a.length);

        AtomBinder.removeItem(a, 4);
        Assert.equals(1, a.length);

        AtomBinder.removeItem(a, 1);
        Assert.equals(0, a.length);

        AtomBinder.removeItem(a, 4);
    }

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

        const w = new AtomWatcher(c, [["firstName"], ["lastName"]], (firstName, lastName) => {
            c.name = `${firstName} ${lastName}`;
        });

        w.init(true);

        Assert.equals("Akash Kava", c.name);

        ba =  bindable._$_bindable;
        Assert.isTrue(ba ? true : false);

        const i = ba.firstName;
        Assert.equals(1, i);

        c.firstName = "Simmi";
        Assert.equals("Simmi Kava", c.name);
    }

    // @Test
    // public plainObjectWithGetter(): void {
    //     const c: ICustomer = {
    //         firstName: "Akash",
    //         lastName: "Kava",
    //         get time(): number {
    //             return (new Date()).getTime();
    //         }
    //     };

    //     const bindable = c as IWatchableObject;
    //     let ba = bindable._$_bindable;

    //     Assert.isTrue(!ba);

    //     const w = new AtomWatcher(c, [["firstName", "lastName", "time"]],
    //      true, false, (firstName, lastName, time) => {
    //         c.name = `${firstName} ${lastName} ${time}`;
    //     });

    //     w.evaluate(true);

    //     Assert.equals("Akash Kava", c.name);

    //     ba =  bindable._$_bindable;
    //     Assert.isTrue(ba ? true : false);

    //     const i = ba.indexOf("firstName");
    //     Assert.doesNotEqual(-1, i);

    //     c.firstName = "Simmi";
    //     Assert.equals("Simmi Kava", c.name);
    // }

}
