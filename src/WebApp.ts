import { App } from "./App";
import { NavigationService } from "./services/NavigationService";
import { WindowService } from "./services/WindowService";

export class WebApp extends App {
    constructor() {
        super();

        this.put(NavigationService, this.resolve(WindowService));
    }
}
