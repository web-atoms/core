import TestItem from "@web-atoms/unit-test/dist/TestItem";
import { MockApp } from "../MockApp";

export class AtomTest extends TestItem {

    constructor(protected readonly app: MockApp = new MockApp()) {
        super();
    }

}
