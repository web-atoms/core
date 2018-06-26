import { MockApp } from "../MockApp";
import { TestItem } from "./base-test";

export class AtomTest extends TestItem {

    constructor(protected readonly app: MockApp = new MockApp()) {
        super();
    }

}
