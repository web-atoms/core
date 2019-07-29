import { App } from "../../App";
import { Atom } from "../../Atom";
import { AtomLoader } from "../../core/AtomLoader";
import { AtomUri } from "../../core/AtomUri";
import { IScreen, IScreenType } from "../../core/IScreen";
import { ArrayHelper, CancelToken, IClassOf, IDisposable, INameValuePairs } from "../../core/types";
import { Inject } from "../../di/Inject";
import { RegisterSingleton } from "../../di/RegisterSingleton";
import { Scope, ServiceCollection } from "../../di/ServiceCollection";
import { JsonService } from "../../services/JsonService";
import { IPageOptions, NavigationService, NotifyType } from "../../services/NavigationService";
import ReferenceService, { ObjectReference } from "../../services/ReferenceService";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import { AtomUI } from "../../web/core/AtomUI";
import AtomAlertWindow from "../controls/AtomAlertWindow";
import { AtomControl } from "../controls/AtomControl";
import AtomNotification from "../controls/AtomNotification";
import { AtomWindow } from "../controls/AtomWindow";
import { AtomStyleSheet } from "../styles/AtomStyleSheet";
import { AtomTheme } from "../styles/AtomTheme";
import { cssNumberToString } from "../styles/StyleBuilder";

export type HostForElementFunc = ((e: HTMLElement) => HTMLElement);

@RegisterSingleton
export class WindowService extends NavigationService {

    /**
     * This is just to preload Alert window.
     */
    public static alertWindow = AtomAlertWindow;

    public readonly screen: IScreen;

    public currentTarget: HTMLElement = null;

    private popups: AtomControl[] = [];

    private hostForElementFunc: HostForElementFunc[] = [];

    private lastPopupID: number = 0;

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
     * This is done to provide mocking behavior for unit testing.
     *
     * @readonly
     * @type {AtomLocation}
     * @memberof BrowserService
     */
    public get location(): AtomUri {
        return new AtomUri(location.href);
    }

    public set location(v: AtomUri) {
        location.href = v.toString();
    }

    constructor(
        @Inject app: App,
        @Inject private jsonService: JsonService) {
        super(app);

        this.screen = app.screen;

        let st: IScreenType = "desktop";

        if (/mobile|android|ios/i.test(window.navigator.userAgent)) {
            st = "mobile";
            if (/tablet/i.test(window.navigator.userAgent)) {
                st = "tablet";
            }
        }

        this.screen.screenType = st;

        if (window) {
            window.addEventListener("click", (e) => {
                this.currentTarget = e.target as HTMLElement;
                this.closePopup();
            });

            const update = (e) => {
                this.refreshScreen();
            };

            // we don't do this in mobile..
            if (st !== "mobile") {
                window.addEventListener("resize", update);
                window.addEventListener("scroll", update);
                document.body.addEventListener("scroll", update);
                document.body.addEventListener("resize", update);
            }

            setTimeout(() => {
                update(null);
            }, 1000);

        }
    }

    public registerHostForWindow(f: HostForElementFunc): IDisposable {
        this.hostForElementFunc.push(f);
        return {
            dispose: () => {
                this.hostForElementFunc.remove(f);
            }
        };
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
        }).catch((e) => {
            // do nothing...
// tslint:disable-next-line: no-console
            console.warn(e);
        });
    }

    public closePopup(): void {
        if (!this.popups.length) {
            return;
        }
        const peek = this.popups[this.popups.length - 1];
        const element = peek.element;
        let target = this.currentTarget;

        while (target) {
            if (target === element) {
                // do not close this popup....
                return;
            }
            if (element._logicalParent === target) {
                return;
            }
            target = target.parentElement;
        }

        this.remove(peek);
    }

    public refresh(): void {
        location.reload(true);
    }

    public getHostForElement(): HTMLElement {
        const ce = this.currentTarget;
        if (!ce) {
            return null;
        }
        for (const iterator of this.hostForElementFunc) {
            const e = iterator(ce);
            if (e) {
                return e;
            }
        }
        return null;
    }

    public refreshScreen() {
        const height = this.screen.height = window.innerHeight || document.body.clientHeight;
        const width = this.screen.width = window.innerWidth || document.body.clientWidth;
        this.screen.scrollLeft = window.scrollX || document.body.scrollLeft || 0;
        this.screen.scrollTop = window.scrollY || document.body.scrollTop || 0;
        this.screen.orientation = width > height ? "landscape" : "portrait";
    }

    public notify(
        message: string,
        title?: string,
        type?: NotifyType,
        delay?: number): void {
        const rs = this.app.resolve(ReferenceService) as ReferenceService;
        const k = rs.put(AtomNotification);
        this.app.runAsync(() => this.openPage(`app://class/${k.key}`, {
            message,
            title,
            type: type || NotifyType.Information,
            timeout: delay
        }));
    }

    protected registerForPopup(): void {

        if (window) {
            window.addEventListener("click", (e) => {
                this.currentTarget = e.target as HTMLElement;
                this.closePopup();
            });
        }
    }

    protected async openWindow<T>(url: AtomUri, options?: IPageOptions): Promise<T> {

        // this is because current target is not yet set
        await Atom.delay(1);

        const lastTarget = this.currentTarget;

        const { view: popup, returnPromise, disposables } = await AtomLoader.loadView<AtomControl>(
            url, this.app, true, () => this.app.resolve(AtomWindowViewModel, true));

        const cancelToken = options.cancelToken;

        if (cancelToken) {
            if (cancelToken.cancelled) {
                throw new Error("cancelled");
            }

            cancelToken.registerForCancel(() => {
                this.remove(popup, true);
            });
        }

        disposables.add(popup);

        const e = popup.element;

        let isPopup = true;

        if (popup instanceof AtomWindow) {
            isPopup = false;
            e.style.opacity = "0";
        }

        e._logicalParent = lastTarget;
        (e as any).sourceUrl = url;

        const pvm = popup.viewModel;
        if (pvm) {
            let ce = this.currentTarget;
            if (ce) {
                while (!ce.atomControl) {
                    ce = ce.parentElement;
                    if (!ce) {
                        break;
                    }
                }
                if (ce && ce.atomControl && ce.atomControl.viewModel) {
                    pvm.parent = ce.atomControl.viewModel;
                }
            }
        }

        const theme = this.app.get(AtomStyleSheet).popup;

        e.style.zIndex = 10000 + this.lastPopupID + "";

        const isNotification = popup instanceof AtomNotification;

        if (isPopup) {

            const sr = AtomUI.screenOffset(this.currentTarget);

            const x = sr.x;
            const y = sr.y;
            const h = sr.height;
            e.style.position = "absolute";
            e.style.left = x + "px";
            e.style.top = (y + h) + "px";
            e.classList.add(theme.host.className);
            this.popups.push(popup);
            disposables.add(() => {
                this.popups.remove(popup);
            });
            document.body.appendChild(e);
            if (isNotification) {
                e.style.opacity = "0";
                this.centerElement(popup);
            }
        } else {

            const eHost = this.getHostForElement();
            if (eHost) {
                eHost.appendChild(e);
            } else {
                const host = document.createElement("div");
                document.body.appendChild(host);
                host.style.position = "absolute";
                host.appendChild(e);
                disposables.add({
                    dispose() {
                        host.remove();
                    }
                });
                this.refreshScreen();
                popup.bind(host, "styleLeft", [["this", "scrollLeft"]], false, cssNumberToString, this.screen);
                popup.bind(host, "styleTop", [["this", "scrollTop"]], false, cssNumberToString, this.screen);
                popup.bind(host, "styleWidth", [["this", "width"]], false, cssNumberToString, this.screen);
                popup.bind(host, "styleHeight", [["this", "height"]], false, cssNumberToString, this.screen);
            }
        }

        this.currentTarget = e;

        popup.bindEvent(document.body, "keyup", (keyboardEvent: KeyboardEvent) => {
            if (keyboardEvent.key === "Escape") {
                this.app.runAsync(() => this.remove(popup));
            }
        });

        disposables.add({
            dispose: () => {
                e.innerHTML = "";
                e.remove();
            }
        });

        return await returnPromise;
    }

    private centerElement(c: AtomControl): void {
        const e = c.element;
        const parent = e.parentElement;
        if (parent as any === window || parent as any === document.body) {
            setTimeout(() => {
            const ew = (document.body.offsetWidth - e.offsetWidth) / 2;
            const eh = window.scrollY + ((window.innerHeight - e.offsetHeight) / 2);
            e.style.left = `${ew}px`;
            e.style.top = `${eh}px`;
            e.style.removeProperty("opacity");
            }, 200);
            return;
        }
        if (parent.offsetWidth <= 0 || parent.offsetHeight <= 0) {
            setTimeout(() => {
                this.centerElement(c);
            }, 100);
            return;
        }

        if (e.offsetWidth <= 0 || e.offsetHeight <= 0) {
            setTimeout(() => {
                this.centerElement(c);
            }, 100);
            return;
        }

        const x = (parent.offsetWidth - e.offsetWidth) / 2;
        const y = (parent.offsetHeight - e.offsetHeight) / 2;
        e.style.left = `${x}px`;
        e.style.top = `${y}px`;
        e.style.removeProperty("opacity");
    }

}
