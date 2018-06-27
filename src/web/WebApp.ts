import { App } from "../App";
import { NavigationService } from "../services/NavigationService";
import { WindowService } from "./services/WindowService";

export class WebApp extends App {
    constructor() {
        super();

        this.put(NavigationService, this.resolve(WindowService));
    }

    protected onReady(f: () => void): void {
        if (document.readyState === "complete") {
            f();
            return;
        }
        document.addEventListener("readystatechange", (e) => {
            f();
        });
    }
}
