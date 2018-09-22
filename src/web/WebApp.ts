import { App } from "../App";
import { AtomOnce } from "../core/AtomOnce";
import { AtomUri } from "../core/AtomUri";
import { ServiceCollection } from "../di/ServiceCollection";
import { BusyIndicatorService } from "../services/BusyIndicatorService";
import { NavigationService } from "../services/NavigationService";
import { AtomControl } from "./controls/AtomControl";
import { ChildEnumerator } from "./core/AtomUI";
import { WebBusyIndicatorService } from "./services/WebBusyIndicatorService";
import { WindowService } from "./services/WindowService";
import { AtomStyleSheet } from "./styles/AtomStyleSheet";
import { AtomTheme } from "./styles/AtomTheme";

export default class WebApp extends App {

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
        this.put(AtomTheme, v);
        this.put(AtomStyleSheet, v);
    }

    private mContextId: number = 1;
    public get contextId(): string {
        return `contextId_${this.mContextId}`;
    }

    private hashUpdater = new AtomOnce();

    constructor() {
        super();

        this.url = new AtomUri(location.href);

        this.put(NavigationService, this.resolve(WindowService));

        this.put(BusyIndicatorService, this.resolve(WebBusyIndicatorService));

        ServiceCollection.instance.registerSingleton(AtomStyleSheet, (sp) => sp.resolve(AtomTheme));

        // let us set contextId
        this.mContextId =  parseInt((this.url.hash.contextId || "0").toString(), 10);
        if (!this.mContextId) {
            //  create new context Id in session...
            for (let index = 0; index < 100; index++) {
                const cid = `contextId${index}`;
                const cidData = sessionStorage.getItem(`contextId${index}`);
                if (!cidData) {
                    this.mContextId = index;
                    sessionStorage.setItem(cid, cid);
                    this.url.hash.contextId = index;
                    this.syncUrl();
                    break;
                }
            }
        }

        window.addEventListener("hashchange", () => {
            this.hashUpdater.run(() => {
                this.url = new AtomUri(location.href);
            });
        });
    }

    /**
     * Do not use this method
     */
    public syncUrl(): void {
        this.hashUpdater.run(() => {
            const currentUrl = new AtomUri(location.href);
            const sourceHash = this.url.hash;
            const keyValues: Array<{ key: string, value: any}> = [];
            let modified: boolean = false;
            for (const key in sourceHash) {
                if (/^\_\$\_/.test(key)) {
                    continue;
                }
                if (sourceHash.hasOwnProperty(key)) {
                    const element = sourceHash[key];
                    const cv = currentUrl.hash[key];
                    if (element !== undefined) {
                        keyValues.push({ key, value: element });
                    }
                    if (cv === element) {
                        continue;
                    }
                    modified = true;
                }
            }
            if (!modified) {
                return;
            }
            const hash = keyValues.map((s) => `${s.key}=${encodeURIComponent(s.value)}`).join("&");
            location.hash = hash;
        });
    }

    protected invokeReady(): void {
        if (document.readyState === "complete") {
            super.invokeReady();
            return;
        }
        document.addEventListener("readystatechange", (e) => {
            super.invokeReady();
        });
    }

}
