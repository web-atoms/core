import { App } from "./App";
import { MockNavigationService } from "./services/MockNavigationService";
import { NavigationService } from "./services/NavigationService";

export class MockApp extends App {

    constructor() {
        super();
        this.put(NavigationService, new MockNavigationService(this));
    }
}
