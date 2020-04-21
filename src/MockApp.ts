import { App } from "./App";
import { MockNavigationService } from "./services/MockNavigationService";
import { NavigationService } from "./services/NavigationService";

export class MockApp extends App {

    private styleElement: HTMLElement;

    constructor() {
        super();
        this.put(NavigationService, new MockNavigationService(this));
    }

    public updateDefaultStyle(textContent: string) {
        if (this.styleElement) {
            if (this.styleElement.textContent === textContent) {
                return;
            }
        }
        const ss = document.createElement("style");

        ss.textContent = textContent;
        if (this.styleElement) {
            this.styleElement.remove();
        }
        document.head.appendChild(ss);
        this.styleElement = ss;
    }

}
