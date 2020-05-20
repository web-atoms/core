import { App } from "../App";
import { AtomOnce } from "../core/AtomOnce";
import { AtomUri } from "../core/AtomUri";
import { ServiceCollection } from "../di/ServiceCollection";
import { BusyIndicatorService } from "../services/BusyIndicatorService";
import { NavigationService } from "../services/NavigationService";
import { ChildEnumerator } from "./core/AtomUI";
import { WebBusyIndicatorService } from "./services/WebBusyIndicatorService";
import { WindowService } from "./services/WindowService";
import { AtomStyleSheet } from "./styles/AtomStyleSheet";
import { AtomTheme } from "./styles/AtomTheme";

declare var UMD: any;

export default class WebApp extends App {

    public get parentElement(): HTMLElement {
        return document.body;
    }

    private mRoot: any;
    public get root(): any {
        return this.mRoot;
    }

    public set root(v: any) {
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

    private styleElement: HTMLElement;

    constructor() {
        super();

        this.url = new AtomUri(location.href);

        this.put(NavigationService, this.resolve(WindowService));

        this.put(WebApp, this);

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

        // registering font awesome
        this.installStyleSheet("https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.9.0/css/all.css");
        this.installStyleSheet({
            href: "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
            integrity: "sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T",
            crossOrigin: "anonymous"
        });
    }

    public installStyleSheet(ssConfig: string |
        { href: string, integrity?: string, crossOrigin?: string}): void {

        if (typeof ssConfig !== "object") {
            ssConfig = { href: ssConfig };
        }

        ssConfig.href = UMD.resolvePath(ssConfig.href);
        const links = document.getElementsByTagName("link");
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < links.length; index++) {
            const element = links[index];
            const href = element.getAttribute("href");
            if (href === ssConfig.href) {
                return;
            }
        }
        const ss = document.createElement("link");
        ss.rel = "stylesheet";
        ss.href = ssConfig.href;
        if (ssConfig.crossOrigin) {
            ss.crossOrigin = ssConfig.crossOrigin;
        }
        if (ssConfig.integrity) {
            ss.integrity = ssConfig.integrity;
        }
        document.head.appendChild(ss);
    }

    public installScript(location: string): Promise<void> {
        location = UMD.resolvePath(location);
        const links = document.getElementsByTagName("script");
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < links.length; index++) {
            const element = links[index];
            const href = element.getAttribute("src");
            if (href === location) {
                return (element as any).loaderPromise;
            }
        }
        const script: HTMLScriptElement = document.createElement("script");
        const p = new Promise<void>((resolve, reject) => {
            script.type = "text/javascript";
            script.src = location;
            const s: any = script as any;
            script.onload = s.onreadystatechange = () => {
                if ((s.readyState && s.readyState !== "complete" && s.readyState !== "loaded")) {
                    return;
                }
                script.onload = s.onreadystatechange = null;
                resolve();
            };
            document.body.appendChild(script);
        });
        (script as any).loaderPromise = p;
        return p;
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

declare global {
    // tslint:disable-next-line: interface-name
    interface Window {
        // tslint:disable-next-line: ban-types
        CustomEvent?: Function;
    }
}

// tslint:disable-next-line: only-arrow-functions
(function() {

    if ( typeof window.CustomEvent === "function" ) { return false; }
    function CustomEvent( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        const evt = document.createEvent( "CustomEvent" );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }
    (window as any).CustomEvent = CustomEvent;
  })();
