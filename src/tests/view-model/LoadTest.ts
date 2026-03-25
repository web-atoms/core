import Assert from "@web-atoms/unit-test/dist/Assert.js";
import Category from "@web-atoms/unit-test/dist/Category.js";
import Test from "@web-atoms/unit-test/dist/Test.js";
import { Atom } from "../../Atom.js";
import CancelTokenFactory from "../../core/CancelTokenFactory.js";
import { CancelToken } from "../../core/types.js";
import DISingleton from "../../di/DISingleton.js";
import { Inject } from "../../di/Inject.js";
import { AtomTest } from "../../unit/AtomTest.js";
import Action from "../../view-model/Action.js";
import { AtomViewModel, Validate, waitForReady } from "../../view-model/AtomViewModel.js";
import Load from "../../view-model/Load.js";

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
        console.log(this.list);
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

