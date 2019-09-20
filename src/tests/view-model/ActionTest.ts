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
import { AtomViewModel, Validate } from "../../view-model/AtomViewModel";
import AtomWebTest from "../web/AtomWebTest";

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

    @Inject
    private remoteService: RemoteService;

    @Inject
    private cancelTokenFactory: CancelTokenFactory;

    @Action({
        init: true,
        watch: true
    })
    public async loadList(): Promise<void> {
        const s = this.search;
        const ct = this.cancelTokenFactory.newToken("load");
        this.list = await this.remoteService.list(s, ct);
    }

}

@Category("View Model Action")
export default class ActionTest extends AtomWebTest {

    @Test
    public async runOnInitSuccess(): Promise<void> {
        const vm = await this.createViewModel(ActionViewModel);
        await Atom.delay(120);
        Assert.equals("Success ", vm.list);
    }
}
