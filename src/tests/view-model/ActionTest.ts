import Category from "@web-atoms/unit-test/dist/Category";
import { Atom } from "../../Atom";
import CancelTokenFactory from "../../core/CancelTokenFactory";
import DISingleton from "../../di/DISingleton";
import { Inject } from "../../di/Inject";
import { AtomTest } from "../../unit/AtomTest";
import Action from "../../view-model/Action";
import { AtomViewModel, Validate } from "../../view-model/AtomViewModel";

@DISingleton()
class RemoteService {
    public async list(p: string): Promise<any> {
        await Atom.delay(10);
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

    private list: any;

    @Inject
    private remoteService: RemoteService;

    @Inject
    private cancelTokenFactory: CancelTokenFactory;

    @Action({
        validate: true,
        watch: true
    })
    public async loadList(): Promise<void> {
        const s = this.search;
        if (!s) {
            return;
        }
        const results = this.remoteService.list(s);
    }

}

@Category("View Model Action")
export default class ActionTest extends AtomTest {

}
