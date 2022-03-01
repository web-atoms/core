import { App } from "../App";
import { Atom } from "../Atom";
import { AtomUri } from "../core/AtomUri";
import { IDisposable, INameValuePairs, INameValues } from "../core/types";
import { Inject } from "../di/Inject";
import { RegisterSingleton } from "../di/RegisterSingleton";
import { ServiceCollection } from "../di/ServiceCollection";
import { AtomViewModel } from "../view-model/AtomViewModel";
import { AtomWindowViewModel } from "../view-model/AtomWindowViewModel";
import { NavigationService } from "./NavigationService";

export interface IWindowRegistration {
    windowType: string;
    action: (vm: AtomViewModel) => any;
}

export class MockConfirmViewModel extends AtomWindowViewModel {

    public message: string;
    public title: string;

}

/**
 * Mock of WindowService for unit tests
 * @export
 * @class MockWindowService
 * @extends {WindowService}
 */
@RegisterSingleton
export class MockNavigationService extends NavigationService {

    public title: string;

    private windowStack: IWindowRegistration[] = [];
    private history: AtomUri[] = [];
    private mLocation: AtomUri = new AtomUri("");

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
        return this.mLocation;
    }

    public set location(v: AtomUri) {
        if (JSON.stringify(this.location) === JSON.stringify(v)) {
            return;
        }
        this.history.push(this.mLocation);
        this.mLocation = v;
    }

    constructor(app: App) {
        super(app);
    }

    public refresh(): void {
        // nothing
    }

    /**
     * Navigate current browser to given url.
     * @param {string} url
     * @memberof BrowserService
     */
    public navigate(url: string): void {
        this.location = new AtomUri(url);
    }

    public back(): void {
        if (this.history.length) {
            const top = this.history.pop();
            this.location = top;
            this.history.pop();
        }
    }

    /**
     * Internal usage
     * @param {string} msg
     * @param {string} [title]
     * @returns {Promise<any>}
     * @memberof MockWindowService
     */
    public alert(msg: string, title?: string): Promise<any> {
        return this.openTestWindow(`__AlertWindow_${msg}`, { message: msg, title });
    }

    /**
     * Internal usage
     * @param {string} msg
     * @param {string} [title]
     * @returns {Promise<boolean>}
     * @memberof MockWindowService
     */
    public confirm(msg: string, title?: string): Promise<boolean> {
        return this.openTestWindow(`__ConfirmWindow_${msg}`, { message: msg, title });
    }

    public openPage<T>(pageName: string, p?: INameValuePairs): Promise<T> {
        return this.openTestWindow(pageName, p);
    }

    public async notify(message: string, title?: string): Promise<void> {
        const url = `__AlertNotification_${message}`;
        const w: any = this.windowStack.find((x) => x.windowType === message);
        if (!w) {
            throw new Error(`No notification registered for "${message}"`);
        }
        w.action({});
    }

    /**
     * Internal usage
     * @template T
     * @param {string} c
     * @param {AtomViewModel} vm
     * @returns {Promise<T>}
     * @memberof MockWindowService
     */
    public openTestWindow<T>(c: string | AtomUri, p?: INameValues): Promise<T> {

        const url = c instanceof AtomUri ? c : new AtomUri(c);

        if (p) {
            for (const key in p) {
                if (p.hasOwnProperty(key)) {
                    const element = p[key];
                    url.query[key] = element;
                }
            }
        }

        return new Promise((resolve, reject) => {
            const w: any = this.windowStack.find((x) => x.windowType === url.path);
            if (!w) {
                const ex: Error = new Error(
                    `No window registered for "${c} with ${(p ? JSON.stringify(p, undefined, 2) : "")}"`);
                reject(ex);
                return;
            }
            setTimeout(() => {
                try {
                    const vm = new AtomWindowViewModel(this.app) as any;
                    for (const key in url.query) {
                        if (url.query.hasOwnProperty(key)) {
                            const element = url.query[key];
                            vm[key] = element;
                        }
                    }
                    resolve(w.action(vm));
                } catch (e) {
                    reject(e);
                }
            }, 5);
        });
    }

    /**
     * Call this method before any method that should expect an alert.
     * You can add many alerts, but each expected alert will only be called
     * once.
     * @param {string} msg
     * @returns {IDisposable}
     * @memberof MockWindowService
     */
    public expectAlert(msg: string): IDisposable {
        return this.expectWindow(`__AlertWindow_${msg}`, (vm) => true);
    }

    /**
     * Call this method before any method that should expect a notification.
     * You can add many alerts, but each expected alert will only be called
     * once.
     * @param {string} msg
     * @returns {IDisposable}
     * @memberof MockWindowService
     */
    public expectNotification(msg: string): IDisposable {
        return this.expectWindow(`__AlertNotification_${msg}`, (vm) => true);
    }

    /**
     * Call this method before any method that should expect a confirm.
     * You can add many confirms, but each expected confirm will only be called
     * once.
     * @param {string} msg
     * @param {(vm:MockConfirmViewModel) => boolean} action
     * @returns {IDisposable}
     * @memberof MockWindowService
     */
    public expectConfirm(msg: string, action: (vm: MockConfirmViewModel) => boolean): IDisposable {
        return this.expectWindow(`__ConfirmWindow_${msg}`, action);
    }

    /**
     * Call this method before any method that should expect a window of given type.
     * Each window will only be used once and return value in windowAction will be
     * resolved in promise created by openWindow call.
     * @template TViewModel
     * @param {string} windowType
     * @param {(vm:TViewModel) => any} windowAction
     * @param {number} [maxDelay=10000]
     * @returns {IDisposable}
     * @memberof MockWindowService
     */
    public expectPopup<TViewModel extends AtomViewModel>(
        popupType: string,
        windowAction: (vm: TViewModel) => any): IDisposable {
        return this.expectWindow(popupType, windowAction);
    }

    /**
     * Call this method before any method that should expect a window of given type.
     * Each window will only be used once and return value in windowAction will be
     * resolved in promise created by openWindow call.
     * @template TViewModel
     * @param {string} windowType
     * @param {(vm:TViewModel) => any} windowAction
     * @param {number} [maxDelay=10000]
     * @returns {IDisposable}
     * @memberof MockWindowService
     */
    public expectWindow<TViewModel extends AtomViewModel>(
        windowType: string,
        windowAction: (vm: TViewModel) => any): IDisposable {

        const registration: any = { windowType, action: windowAction };

        registration.action = (vm: TViewModel) => {
            this.removeRegistration(registration);
            return windowAction(vm);
        };

        this.windowStack.push(registration);

        return {
            dispose: () => {
                this.removeRegistration(registration);
            }
        };
    }

    public removeRegistration(r: IWindowRegistration): void {
        this.windowStack = this.windowStack.filter((x) => x !== r);
    }

    public assert(): void {
        if (!this.windowStack.length) {
            return;
        }

        throw new Error(`Expected windows did not open ${this.windowStack.map((x) => `"${x.windowType}"`).join(",")}`);
    }

    protected registerForPopup(): void {
        // nothing
    }

    protected forceRemove(view: any): void {
        throw new Error("Method not implemented.");
    }

    protected openWindow<T>(url: AtomUri): Promise<T> {
        return this.openTestWindow(url);
    }

}
