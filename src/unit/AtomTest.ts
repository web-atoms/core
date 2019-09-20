import TestItem from "@web-atoms/unit-test/dist/TestItem";
import { IClassOf } from "../core/types";
import { MockApp } from "../MockApp";
import { AtomViewModel, waitForReady } from "../view-model/AtomViewModel";

export class AtomTest extends TestItem {

    constructor(protected readonly app: MockApp = new MockApp()) {
        super();
    }

    public async createViewModel<T extends AtomViewModel>(c: IClassOf<T>): Promise<T> {
        const vm = this.app.resolve(c, true);
        await waitForReady(vm);
        return vm;
    }

}
