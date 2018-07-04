import { App } from "../App";
import { NavigationService } from "../services/NavigationService";
import { AtomControl } from "./controls/AtomControl";
import { ChildEnumerator } from "./core/AtomUI";
import { WindowService } from "./services/WindowService";
import { AtomStyleSheet } from "./styles/AtomStyleSheet";
import { AtomTheme } from "./styles/AtomTheme";

export class WebApp extends App {

    public get parentElement(): HTMLElement {
        return document.body;
    }

    private mRoot: AtomControl;
    public get root(): AtomControl {
        return this.mRoot;
    }

    public set root(v: AtomControl) {
        const old = this.mRoot;
        if (old) {
            old.dispose();
        }
        this.mRoot = v;
        if (!v) {
            return;
        }
        const pe = this.parentElement;
        const ce = new ChildEnumerator(pe);
        const de: HTMLElement[] = [];
        while (ce.next()) {
            de.push(ce.current);
        }
        for (const iterator of de) {
            iterator.remove();
        }
        pe.appendChild(v.element);
    }

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
