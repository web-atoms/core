import { App } from "../App";
import { NavigationService } from "../services/NavigationService";
import { WindowService } from "./services/WindowService";
import { AtomStyleSheet } from "./styles/AtomStyleSheet";
import { AtomTheme } from "./styles/AtomTheme";

export class WebApp extends App {

    public get theme(): AtomStyleSheet {
        return this.get(AtomStyleSheet);
    }

    public set theme(v: AtomStyleSheet) {
        this.put(AtomStyleSheet, v);
    }

    constructor() {
        super();

        this.put(NavigationService, this.resolve(WindowService));
        this.theme = this.resolve(AtomTheme);
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
