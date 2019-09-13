import Assert from "@web-atoms/unit-test/dist/Assert";
import Category from "@web-atoms/unit-test/dist/Category";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";
import { Atom } from "../../Atom";
import CancelTokenFactory from "../../core/CancelTokenFactory";
import { Inject } from "../../di/Inject";
import { AtomTest } from "../../unit/AtomTest";
import { AtomViewModel, waitForReady } from "../../view-model/AtomViewModel";

class CVM extends AtomViewModel {

    @Inject
    private cancelTokenFactory: CancelTokenFactory;

    public async list(): Promise<void> {
        await Atom.delay(10, this.cancelTokenFactory.newToken("list"));
    }

}

@Category("Cancel Token Factory")
export default class CancelTokenFactoryTest extends AtomTest {

    @Test
    public async vmTest(): Promise<void> {

        const vm = this.app.resolve(CVM, true);

        await waitForReady(vm);

        await vm.list();

        const p = vm.list();

        const p2 = vm.list();

        Assert.throwsAsync("cancelled", async () => await p);

        await p2;

        vm.dispose();

    }

}
