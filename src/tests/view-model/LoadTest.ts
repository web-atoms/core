import Assert from "@web-atoms/unit-test/dist/Assert";
import Category from "@web-atoms/unit-test/dist/Category";
import Test from "@web-atoms/unit-test/dist/Test";
import { Atom } from "../../Atom";
import CancelTokenFactory from "../../core/CancelTokenFactory";
import { CancelToken } from "../../core/types";
import DISingleton from "../../di/DISingleton";
import { Inject } from "../../di/Inject";
import { AtomTest } from "../../unit/AtomTest";
import Action from "../../view-model/Action";
import { AtomViewModel, Validate, waitForReady } from "../../view-model/AtomViewModel";
import Load from "../../view-model/Load";
import AtomWebTest from "../../unit/AtomWebTest";

@DISingleton()
class RemoteService {
    public async list(p: string, ct: CancelToken): Promise<any> {
        await Atom.delay(100, ct);
        if (ct.cancelled) {
            throw new Error(ct.cancelled);
        }
        if (p === undefined || p === null) {
            throw new Error("Search cannot be null/undefined");
        }
        return `Success ${p}`;
    }
}

class ActionViewModel extends AtomViewModel {

    public type: string = "";

    public search: string = "";

    @Validate
    public get errorType(): string {
        return this.type ? "" : "Type cannot be empty";
    }

    public list: any;

    public loaded: boolean;

    @Inject
    private remoteService: RemoteService;

    @Load({ init: true, watch: true })
    public async loadList(ct: CancelToken): Promise<void> {
        const s = this.search;
        this.list = await this.remoteService.list(s, ct);
    }

    @Load({ init: true})
    public async load(): Promise<void> {
        await Atom.delay(10);
        this.loaded = true;
    }

}

class ErrorViewModel extends AtomViewModel {

    @Load({ watch: true })
    public async nothingToWatch() {
        await Atom.delay(1);
    }

}

@Category("View Model Load")
export default class LoadTest extends AtomWebTest {

    @Test
    public async runOnLoadError(): Promise<void> {
        await this.createViewModel(ActionViewModel);
        await Atom.delay(120);
    }

    @Test
    public async runOnSuccess(): Promise<void> {
        const vm = this.app.resolve(ActionViewModel, true) as ActionViewModel;
        vm.type = "a";
        await waitForReady(vm);
        await Atom.delay(120);
        Assert.equals("Success ", vm.list);
        Assert.equals(true, vm.loaded);
    }

    @Test
    public async watchError(): Promise<void> {
        const vm = this.app.resolve(ActionViewModel, true) as ActionViewModel;
        vm.type = "a";
        await waitForReady(vm);
        await Atom.delay(120);
        Assert.equals("Success ", vm.list);

        this.navigationService.expectAlert("Error: Search cannot be null/undefined");
        // set search as null
        vm.list = null;
        vm.search = null;
        await Atom.delay(300);

        Assert.isNull(vm.list);
    }

    @Test
    public async watchSuccess(): Promise<void> {
        const vm = this.app.resolve(ActionViewModel, true) as ActionViewModel;
        vm.type = "a";
        await waitForReady(vm);
        await Atom.delay(120);
        Assert.equals("Success ", vm.list);

        // set search as null
        vm.list = null;
        vm.search = "b";
        await Atom.delay(300);

        Assert.equals("Success b", vm.list);
    }

    @Test
    public async watchSuccessWithDelay(): Promise<void> {
        const vm = this.app.resolve(ActionViewModel, true) as ActionViewModel;
        vm.type = "a";
        await waitForReady(vm);
        await Atom.delay(120);
        Assert.equals("Success ", vm.list);

        // set search as null
        vm.list = null;
        vm.search = "b";
        await Atom.delay(20);
        vm.search = "c";
        await Atom.delay(300);

        Assert.equals("Success c", vm.list);
    }

    @Test
    public async error(): Promise<void> {
        try {
            const vm = this.app.resolve(ErrorViewModel, true) as ErrorViewModel;
            await waitForReady(vm);
                // throw new Error("failed");
        } catch (e) {
            // do nothing...
            // tslint:disable-next-line: no-console
            console.error(e);
        }
    }
}
