import { App } from "../../App";
import { Atom } from "../../Atom";
import { AtomLoader } from "../../core/AtomLoader";
import { AtomUri } from "../../core/AtomUri";
import { ArrayHelper, IClassOf, IDisposable, INameValuePairs } from "../../core/types";
import { Inject } from "../../di/Inject";
import { RegisterSingleton } from "../../di/RegisterSingleton";
import { Scope, ServiceCollection } from "../../di/ServiceCollection";
import { JsonService } from "../../services/JsonService";
import { ILocation, NavigationService } from "../../services/NavigationService";
import { AtomUI } from "../../web/core/AtomUI";
import { AtomControl, IAtomControlElement } from "../controls/AtomControl";
import { AtomWindow } from "../controls/AtomWindow";
import { AtomStyleSheet } from "../styles/AtomStyleSheet";
import { AtomTheme } from "../styles/AtomTheme";

@RegisterSingleton
export class WindowService extends NavigationService {

    private popups: AtomControl[] = [];

    private lastPopupID: number = 0;

    private currentTarget: HTMLElement = null;

    /**
     * Get current window title
     *
     * @type {string}
     * @memberof BrowserService
     */
    get title(): string {
        return window.document.title;
    }

    /**
     * Set current window title
     * @memberof BrowserService
     */
    set title(v: string) {
        window.document.title = v;
    }

    /**
     * Gets current location of browser, this does not return
     * actual location but it returns values of browser location.
     * This is done to provide mocking behaviour for unit testing.
     *
     * @readonly
     * @type {AtomLocation}
     * @memberof BrowserService
     */
    public get location(): ILocation {
        return {
            href: location.href,
            hash: location.hash,
            host: location.host,
            hostName: location.hostname,
            port: location.port,
            protocol: location.protocol
        };
    }

    constructor(@Inject private app: App, @Inject private jsonService: JsonService) {
        super();

        if (window) {
            window.addEventListener("click", (e) => {
                this.currentTarget = e.target as HTMLElement;
                this.closePopup();
            });
        }
    }

    /**
     * Navigate current browser to given url.
     * @param {string} url
     * @memberof BrowserService
     */
    public navigate(url: string): void {
        location.href = url;
    }

    public back(): void {
        window.history.back();
    }

    public register(id: string, type: IClassOf<AtomControl>): void {
        ServiceCollection.instance.register(type, null, Scope.Transient, id);
    }

    public confirm(message: string, title: string): Promise<any> {
        return this.openPage("web-atoms-core/dist/{platform}/controls/AtomAlertWindow", {
            okTitle: "Yes",
            cancelTitle: "No",
            title,
            message
        });
    }

    public alert(message: string | any, title?: string): Promise<any> {
        if (typeof message !== "string") {
            message = message.toString();
        }
        return this.openPage("web-atoms-core/dist/{platform}/controls/AtomAlertWindow", {
            message,
            title,
            okTitle: "Ok",
            cancelTitle: ""
        });
    }

    public openPage<T>(pageName: string, p?: INameValuePairs): Promise<T> {
        return this.openPopupAsync(pageName, p, true);
    }

    public closePopup(): void {
        if (!this.popups.length) {
            return;
        }
        const peek = this.popups[this.popups.length - 1];
        const element = peek.element;
        let target = this.currentTarget;

        const theme = this.app.get(AtomTheme).popup;

        while (target) {
            if (target === element) {
                // do not close this popup....
                return;
            }
            target = target.parentElement;
        }

        const message = `atom-window-cancel:${peek.element.id}`;
        const device = this.app.get(App);
        device.broadcast(message, "cancelled");
    }

    public refresh(): void {
        location.reload(true);
    }

    protected registerForPopup(): void {

        if (window) {
            window.addEventListener("click", (e) => {
                this.currentTarget = e.target as HTMLElement;
                this.closePopup();
            });
        }
    }

    private async openPopupAsync<T>(windowId: string, p: INameValuePairs, isPopup: boolean): Promise<T> {

        const  url = new AtomUri(windowId);

        if (p) {
            for (const key in p) {
                if (p.hasOwnProperty(key)) {
                    const element = p[key];
                    url.query[key] = element;
                }
            }
        }

        if (url.protocol && /^tab\:$/i.test(url.protocol)) {
            this.app.broadcast(url.host, url.toString());
            return;
        }

        // const popup = this.app.resolve(windowId, true) as AtomControl;
        // const popupType = await UMD.resolveViewClassAsync(url.path);
        const popup = await AtomLoader.loadView<AtomControl>(url, this.app);
        const e = popup.element;

        if (popup instanceof AtomWindow) {
            isPopup = false;
        }

        if (isPopup) {
            await Atom.delay(10);
        }

        return await new Promise<T>((resolve, reject) => {

            const theme = this.app.get(AtomStyleSheet).popup;

            e.id = `atom_popup_${this.lastPopupID++}`;
            e.style.zIndex = 10000 + this.lastPopupID + "";

            if (isPopup) {
                (popup.element as IAtomControlElement)._logicalParent
                    = this.currentTarget as IAtomControlElement;

                const sr = AtomUI.screenOffset(this.currentTarget);

                const x = sr.x;
                const y = sr.y;
                const h = sr.height;
                e.style.position = "absolute";
                e.style.left = x + "px";
                e.style.top = (y + h) + "px";
                e.classList.add(theme.host.className);
                // popup.element.classList.add("close-popup");
                this.popups.push(popup);
            }

            document.body.appendChild(e);

            const disposables: IDisposable[] = [popup];

            const closeFunction = () => {
                for (const iterator of disposables) {
                    iterator.dispose();
                }
                e.remove();
                ArrayHelper.remove(this.popups, (a) => a === popup);
            };

            const device = this.app.get(App);

            disposables.push(device.subscribe(`atom-window-close:${e.id}`, (g, i) => {
                closeFunction();
                resolve(i);
            }));

            disposables.push(device.subscribe(`atom-window-cancel:${e.id}`, (g, i) => {
                closeFunction();
                reject(i || "cancelled");
            }));

            const wvm = popup.viewModel;
            if (wvm) {
                wvm.windowName = e.id;

                // for (const key in url.query) {
                //     if (url.query.hasOwnProperty(key)) {
                //         const element = url.query[key];
                //         if (typeof element === "object") {
                //             wvm[key] = this.jsonService.parse(this.jsonService.stringify(element));
                //         } else {
                //             wvm[key] = element;
                //         }
                //     }
                // }
            }

        });
    }
}
