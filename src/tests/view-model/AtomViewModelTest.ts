import { Assert } from "../../unit/Assert";
import { Test } from "../../unit/Test";
import { AtomViewModel, BindableBroadcast,
    BindableReceive, Receive, Validate, Watch } from "../../view-model/AtomViewModel";
import AtomWebTest from "../web/AtomWebTest";

export class AtomViewModelTest extends AtomWebTest {

    @Test
    public async broadCastingProperty(): Promise<any> {
        const b = new BroadcastViewModel(this.app);
        const r = new ReceiveViewModel(this.app);

        await Promise.all([b.waitForReady(), r.waitForReady()]);

        b.channel1 = "a";

        Assert.equals("a", r.channel1);

        b.broadcast("channel2", "b");

        Assert.equals("b", r.channel2);
    }

    @Test
    public async disposeTest(): Promise<void> {

        let vm = new TestViewModel(this.app);

        await vm.waitForReady();

        vm.dispose();

        let disposed: boolean = false;

        vm = new TestViewModel(this.app);

        vm.registerDisposable({
            dispose() {
                disposed = true;
            }
        });

        vm.dispose();

        Assert.isTrue(disposed);

        vm = new TestViewModel(this.app);

        disposed = false;

        vm.registerDisposable({
            dispose() {
                disposed = true;
            }
        }).dispose();

        Assert.isTrue(disposed);

        disposed = false;

        vm.dispose();

        Assert.isFalse(disposed);
    }

    @Test
    public async watchTest(): Promise<void> {

        const vm = new TestViewModel(this.app);

        await vm.waitForReady();

        vm.model.firstName = "Akash";

        Assert.equals("Akash", vm.model.fullName);

        vm.model.lastName = "Kava";

        Assert.equals("Akash Kava", vm.model.fullName);

        vm.dispose();

        vm.model.firstName = "A";
        vm.model.lastName = "B";

        Assert.equals("Akash Kava", vm.model.fullName);

    }

    @Test
    public async validateTest(): Promise<any> {

        const vm = new TestViewModel(this.app);

        await vm.waitForReady();

        Assert.isEmpty(vm.errorFirstName);

        Assert.isEmpty(vm.errorLastName);

        const noErrors = vm.errors;
        Assert.equals(0, noErrors.length);

        await vm.save();

        Assert.isNotEmpty(vm.errorFirstName);

        Assert.isNotEmpty(vm.errorLastName);

        vm.model.firstName = "Akash";

        Assert.isEmpty(vm.errorFirstName);

        Assert.isNotEmpty(vm.errorLastName);

        vm.model.lastName = "Kava";

        Assert.isEmpty(vm.errorLastName);

        vm.model.firstName = "";
        vm.model.lastName = "";

        Assert.isNotEmpty(vm.errorFirstName);
        Assert.isNotEmpty(vm.errorLastName);

        const e = vm.errors;
        Assert.doesNotEqual(0, e.length);

        vm.model.firstName = "A";
        vm.model.lastName = "B";

        Assert.isEmpty(vm.errorFirstName);
        Assert.isEmpty(vm.errorLastName);

        vm.dispose();

        // vm.model.firstName = "";
        // vm.model.lastName = "";

        // Assert.isEmpty(vm.errorFirstName);
        // Assert.isEmpty(vm.errorLastName);
    }

}

class TestViewModel extends AtomViewModel {

    public model: any = {};

    public async init(): Promise<any> {
        // nothing...
    }

    @Watch
    public watchModel(): void {
        this.model.fullName = [this.model.firstName, this.model.lastName]
            .filter((s) => s)
            .join(" ");
    }

    @Validate
    public get errorFirstName(): string {
        return this.model.firstName ? "" : "Firstname cannot be empty";
    }

    @Validate
    public get errorLastName(): string {
        return this.model.lastName ? "" : "Lastname cannot be empty";
    }

    public async save(): Promise<any> {
        if (!this.isValid) {
            return;
        }
    }
}

class BroadcastViewModel extends AtomViewModel {

    @BindableBroadcast("channel1")
    public channel1: string;

}

class ReceiveViewModel extends AtomViewModel {

    @BindableReceive("channel1")
    public channel1: string;

    public channel2: any;

    @Receive("channel2")
    public receiveSome(sender: any, message: any): void {
        this.channel2 = message;
    }

}
