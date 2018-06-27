import { MockApp } from "../MockApp";
import { TestItem } from "./TestItem";

export class AtomTest extends TestItem {

    constructor(protected readonly app: MockApp = new MockApp()) {
        super();
    }

}
