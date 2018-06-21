import { AtomDisposable, IDisposable } from "../core/types";
import { RegisterSingleton } from "../di/RegisterSingleton";
import { ServiceCollection } from "../di/ServiceCollection";
import { AtomViewModel } from "../view-model/AtomViewModel";
import { AtomWindowViewModel } from "../view-model/AtomWindowViewModel";
import { WindowService } from "./WindowService";

export interface IWindowRegistration {
    windowType: string;
    action: (vm: AtomViewModel) => any;
}

export class MockConfirmViewModel extends AtomWindowViewModel {

    public message: string;
    public title: string;

}

@RegisterSingleton
/**
 * Mock of WindowService for unit tests
 * @export
 * @class MockWindowService
 * @extends {WindowService}
 */
export class MockWindowService extends WindowService {

    private windowStack: IWindowRegistration[] = [];

    /**
     * Internal usage
     * @param {string} msg
     * @param {string} [title]
     * @returns {Promise<any>}
     * @memberof MockWindowService
     */
    public alert(msg: string, title?: string): Promise<any> {
        const mvm: MockConfirmViewModel = new MockConfirmViewModel();
        mvm.message = msg;
        mvm.title = title;
        return this.openWindow(`__AlertWindow_${msg}`, mvm);
    }

    /**
     * Internal usage
     * @param {string} msg
     * @param {string} [title]
     * @returns {Promise<boolean>}
     * @memberof MockWindowService
     */
    public confirm(msg: string, title?: string): Promise<boolean> {
        const mvm: MockConfirmViewModel = new MockConfirmViewModel();
        mvm.message = msg;
        mvm.title = title;
        return this.openWindow(`__ConfirmWindow_${msg}`, mvm);
    }

    /**
     * Internal usage
     * @template T
     * @param {string} c
     * @param {AtomViewModel} vm
     * @returns {Promise<T>}
     * @memberof MockWindowService
     */
    public openPopup<T>(c: string, vm: AtomViewModel): Promise<T> {
        return this.openWindow(c, vm);
    }

    /**
     * Internal usage
     * @template T
     * @param {string} c
     * @param {AtomViewModel} vm
     * @returns {Promise<T>}
     * @memberof MockWindowService
     */
    public openWindow<T>(c: string, vm: AtomViewModel): Promise<T> {
        return new Promise((resolve, reject) => {
            const w: any = this.windowStack.find((x) => x.windowType === c);
            if (!w) {
                const ex: Error = new Error(`No window registered for ${c}`);
                reject(ex);
                return;
            }
            setTimeout(() => {
                try {
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

        return new AtomDisposable(() => {
            this.removeRegistration(registration);
        });
    }

    public removeRegistration(r: IWindowRegistration): void {
        this.windowStack = this.windowStack.filter((x) => x !== r);
    }

    public assert(): void {
        if (!this.windowStack.length) {
            return;
        }

        throw new Error(`Expected windows did not open ${this.windowStack.map((x) => x.windowType).join(",")}`);
    }

}

ServiceCollection.instance.registerSingleton(WindowService, (sp) => new MockWindowService());
