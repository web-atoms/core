import { ServiceProvider } from "./di/ServiceProvider";
import { NavigationService } from "./services/NavigationService";
import { WindowService } from "./services/WindowService";

export class App {

    constructor() {
        setTimeout(() => {
            this.onReady(() => this.main());
        }, 5);

        // register window
        ServiceProvider.global.put(NavigationService, new WindowService());
    }

    public main(): void {
        // load app here..
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
