import Assert from "@web-atoms/unit-test/dist/Assert.js";
import Category from "@web-atoms/unit-test/dist/Category.js";
import Test from "@web-atoms/unit-test/dist/Test.js";
import TestItem from "@web-atoms/unit-test/dist/TestItem.js";
import { Atom } from "../../Atom.js";
import CancelTokenFactory from "../../core/CancelTokenFactory.js";
import { Inject } from "../../di/Inject.js";
import { AtomTest } from "../../unit/AtomTest.js";
import { AtomViewModel, waitForReady } from "../../view-model/AtomViewModel.js";

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
