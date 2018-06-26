import { App } from "../App";
import { Atom } from "../Atom";
import { AtomAlertWindow } from "../controls/AtomAlertWindow";
import { AtomControl, IAtomControlElement } from "../controls/AtomControl";
import { AtomWindow } from "../controls/AtomWindow";
import { AtomUI } from "../core/atom-ui";
import { bindableProperty } from "../core/bindable-properties";
import { ArrayHelper, IClassOf, IDisposable } from "../core/types";
import { Inject } from "../di/Inject";
import { Register } from "../di/Register";
import { RegisterSingleton } from "../di/RegisterSingleton";
import { Scope, ServiceCollection } from "../di/ServiceCollection";
import { ServiceProvider } from "../di/ServiceProvider";
import { AtomTheme } from "../styles/Theme";
import { AtomViewModel } from "../view-model/AtomViewModel";
import { AtomWindowViewModel } from "../view-model/AtomWindowViewModel";
import { ILocation, NavigationService } from "./NavigationService";

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

    constructor(@Inject private serviceProvider: ServiceProvider) {
        super();

        this.register("alert-window", AtomAlertWindow);

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
        const vm = this.serviceProvider.resolve(AtomAlertViewModel, true);
        vm.okTitle = "Yes";
        vm.cancelTitle = "No";
        vm.title = title;
        vm.message = message;
        return this.openWindow("alert-window", vm);
    }

    public alert(message: string, title?: string): Promise<any> {
        const vm = this.serviceProvider.resolve(AtomAlertViewModel, true);
        vm.okTitle = "Ok";
        vm.cancelTitle = "";
        vm.title = title;
        vm.message = message;
        return this.openWindow("alert-window", vm);
    }

    public openPage<T>(pageName: string, vm: AtomViewModel): Promise<T> {
        return this.openPopupAsync(pageName, vm, true);
    }

    public async openPopup<T>(windowId: string, vm: AtomViewModel): Promise<T> {
        await Atom.delay(5);
        return await this.openPopupAsync<T>(windowId, vm, true);
    }

    public openWindow<T>(windowId: string, vm: AtomViewModel): Promise<T> {
        return this.openPopupAsync<T>(windowId, vm, false);
    }

    public closePopup(): void {
        if (!this.popups.length) {
            return;
        }
        const peek = this.popups[this.popups.length - 1];
        const element = peek.element;
        let target = this.currentTarget;

        const theme = this.serviceProvider.get(AtomTheme).popup;

        while (target) {

            if (target.classList.contains(theme.host.className)) {
                break;
            }
            if (target === element) {
                // do not close this popup....
                return;
            }
            target = target.parentElement;
        }

        const message = `atom-window-cancel:${peek.element.id}`;
        const device = this.serviceProvider.get(App);
        device.broadcast(message, "cancelled");
    }

    protected registerForPopup(): void {

        this.register("alert-window", AtomAlertWindow);

        if (window) {
            window.addEventListener("click", (e) => {
                this.currentTarget = e.target as HTMLElement;
                this.closePopup();
            });
        }
    }

    private openPopupAsync<T>(windowId: string, vm: AtomViewModel, isPopup: boolean): Promise<T> {
        return new Promise((resolve, reject) => {
            const popup = this.serviceProvider.resolve(windowId) as AtomControl;
            if (vm) {
                popup.viewModel = vm;
            }
            const e = popup.element;

            if (popup instanceof AtomWindow) {
                isPopup = false;
            }

            const theme = this.serviceProvider.get(AtomTheme).popup;

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

            const device = this.serviceProvider.get(App);

            disposables.push(device.subscribe(`atom-window-close:${e.id}`, (g, i) => {
                closeFunction();
                resolve(i);
            }));

            disposables.push(device.subscribe(`atom-window-cancel:${e.id}`, (g, i) => {
                closeFunction();
                reject(i);
            }));

            const wvm = vm as AtomWindowViewModel;
            if (wvm) {
                wvm.windowName = e.id;
            }

        });
    }
}

class AtomAlertViewModel extends AtomWindowViewModel {

    @bindableProperty
    public title: string;

    @bindableProperty
    public message: string;

    @bindableProperty
    public okTitle: string;

    @bindableProperty
    public cancelTitle: string;

    public onOkClicked(): void {
        this.close(true);
    }

    public onCancelClicked(): void {
        this.cancel();
    }
}
