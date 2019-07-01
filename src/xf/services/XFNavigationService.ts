import { App } from "../../App";
import { AtomBridge } from "../../core/AtomBridge";
import { AtomDisposableList } from "../../core/AtomDisposableList";
import { AtomLoader } from "../../core/AtomLoader";
import { AtomUri } from "../../core/AtomUri";
import { INameValuePairs } from "../../core/types";
import { Inject } from "../../di/Inject";
import { RegisterSingleton } from "../../di/RegisterSingleton";
import { JsonService } from "../../services/JsonService";
import { NavigationService, NotifyType } from "../../services/NavigationService";
import ReferenceService, { ObjectReference } from "../../services/ReferenceService";
import { AtomControl } from "../../web/controls/AtomControl";
import { AtomUI } from "../../web/core/AtomUI";

interface IDeviceNavigationService {
    getLocation(): string;
    setLocation(v: string): void;
}

declare var bridge: {
    navigationService: IDeviceNavigationService;
    alert(message: string, title: string, success: () => void, failed: (r) => void);
    confirm(message: string, title: string, success: () => void, failed: (r) => void);
    getTitle(): string;
    setTitle(v: string): void;
    setRoot(e: any): void;
    pushPage(e: any, success: () => void, failed: (r) => void);
};

@RegisterSingleton
export default class XFNavigationService extends NavigationService {

    private stack: string[] = [];

    public get title(): string {
        // return bridge.getTitle();
        throw new Error("Not supported");
    }
    public set title(v: string) {
        // bridge.setTitle(v);
        throw new Error("Not supported");
    }

    // private mLocation: ILocation;
    public get location(): AtomUri {
        return new AtomUri( bridge.navigationService.getLocation() );
    }

    public set location(v: AtomUri) {
        bridge.navigationService.setLocation(v.toString());
    }

    private windowId: number = 1;

    constructor(app: App, @Inject private jsonService: JsonService) {
        super(app);
    }

    public alert(message: string | any, title?: string): Promise<any> {
        if (typeof message !== "string") {
            message = message.toString();
        }
        return new Promise((resolve, reject) => {
            bridge.alert(message, title, () => {
                resolve();
            }, (f) => {
                reject(f);
            });
        });
    }
    public confirm(message: string, title?: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bridge.confirm(message, title, () => {
                resolve();
            }, (f) => {
                reject(f);
            });
        });
    }

    public notify(message: string, title?: string, type?: NotifyType, delay?: number): void {
        // display toast pending..
        // tslint:disable-next-line: no-console
        console.warn("Display toast not yet implemented");
    }

    public navigate(url: string): void {
        const  uri = new AtomUri(url);
        this.stack.push(url);
        this.app.runAsync(async () => {
            const { view: popup } = await AtomLoader.loadView<AtomControl>(uri, this.app);
            bridge.setRoot(popup.element);
        });
    }

    public back(): void {
        if (this.stack.length) {
            const url = this.stack.pop();
            this.app.runAsync(async () => {
                const uri = new AtomUri(url);
                const { view: popup } = await AtomLoader.loadView<AtomControl>(uri, this.app);
                bridge.setRoot(popup.element);
            });
        }
    }

    public refresh(): void {
        AtomBridge.instance.reset();
    }

    protected async openWindow<T>(url: AtomUri): Promise<T> {

        const { view: popup, disposables, returnPromise, id } = await AtomLoader.loadView(url, this.app);

        AtomBridge.instance.setValue(popup.element, "name", id);

        bridge.pushPage(popup.element, () => {
            // reject("cancelled");
            // do nothing...
        }, (e) => {
            disposables.dispose();
        });

        return returnPromise;
    }

}
