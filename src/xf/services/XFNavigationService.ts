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

    constructor(@Inject private app: App, @Inject private jsonService: JsonService) {
        super();
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

    public async openPage<T>(pageName: string, p?: INameValuePairs): Promise<T> {
        const  url = new AtomUri(pageName);

        if (p) {
            for (const key in p) {
                if (p.hasOwnProperty(key)) {
                    const element = p[key];
                    if (element === undefined) {
                        continue;
                    }
                    if (element === null) {
                        url.query["json:" + key] = "null";
                        continue;
                    }
                    if (key.startsWith("ref:")) {
                        const r = element instanceof ObjectReference ?
                            element :
                            this.app.get(ReferenceService).put(element);
                        url.query[key] = r.key;
                        continue;
                    }
                    if (typeof element !== "string" &&
                        (typeof element === "object" || Array.isArray(element))) {
                        url.query["json:" + key] = JSON.stringify(element);
                    } else {
                        url.query[key] = element;
                    }
                }
            }
        }

        // not supported
        // if (url.protocol && /^tab\:$/i.test(url.protocol)) {
        //     this.app.broadcast(url.host, url.toString());
        //     return;
        // }

        const popup = await AtomLoader.loadView(url, this.app);

        const id = `AtomWindow_${this.windowId++}`;

        if (popup.viewModel) {
            popup.viewModel.windowName = id;
        }

        return await new Promise<T>((resolve, reject) => {

            const disposables = new AtomDisposableList();
            // we will not dispose popup or window
            // because page should be disposed when they are out of the navigation stack
            // disposables.add(popup);

            const done = (success: boolean, r?: any, e?: any) => {
                disposables.dispose();
                if (success) {
                    resolve(r);
                } else {
                    reject(e || "cancelled");
                }
            };

            disposables.add(this.app.subscribe(`atom-window-close:${id}`, (g, i) => {
                AtomBridge.instance.close(popup.element, () => {
                    done(true, i);
                }, (e) => {
                    done(false, null, e);
                });
            }));

            disposables.add(this.app.subscribe(`atom-window-cancel:${id}`, (g, i) => {
                AtomBridge.instance.close(popup.element, () => {
                    done(false, null, i);
                }, (e) => {
                    done(false, null, e);
                });
            }));

            AtomBridge.instance.setValue(popup.element, "name", id);

            bridge.pushPage(popup.element, () => {
                // reject("cancelled");
                // do nothing...
            }, (e) => {
                disposables.dispose();
                reject(e || "cancelled");
            });
        });

    }

    public navigate(url: string): void {
        const  uri = new AtomUri(url);
        this.stack.push(url);
        this.app.runAsync(async () => {
            const popup = await AtomLoader.loadView<AtomControl>(uri, this.app);
            bridge.setRoot(popup.element);
        });
    }

    public back(): void {
        if (this.stack.length) {
            const url = this.stack.pop();
            this.app.runAsync(async () => {
                const uri = new AtomUri(url);
                const popup = await AtomLoader.loadView<AtomControl>(uri, this.app);
                bridge.setRoot(popup.element);
            });
        }
    }

    public refresh(): void {
        AtomBridge.instance.reset();
    }
}
