import { Atom } from "../../Atom";
import CancelTokenFactory from "../../core/CancelTokenFactory";
import { Inject } from "../../di/Inject";
import { Assert } from "../../unit/Assert";
import { AtomTest } from "../../unit/AtomTest";
import { Category } from "../../unit/Category";
import { Test } from "../../unit/Test";
import { TestItem } from "../../unit/TestItem";
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
