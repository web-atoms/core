import { App } from "../../App";
import { AtomDisposableList } from "../../core/AtomDisposableList";
import { AtomUri } from "../../core/AtomUri";
import { INameValuePairs } from "../../core/types";
import { Inject } from "../../di/Inject";
import { JsonService } from "../../services/JsonService";
import { ILocation, NavigationService } from "../../services/NavigationService";
import { AtomViewLoader } from "../../web/AtomViewLoader";
import { AtomUI } from "../../web/core/AtomUI";

declare var bridge: any;

declare var navigationService: {
    alert(message: string, title: string, success: () => void, failed: (r) => void);
    confirm(message: string, title: string, success: () => void, failed: (r) => void);
    getTitle(): string;
    setTitle(v: string): void;
};

export default class XFNavigationService extends NavigationService {

    private stack: string[] = [];

    public get title(): string {
        return navigationService.getTitle();
    }
    public set title(v: string) {
        navigationService.setTitle(v);
    }

    private mLocation: ILocation;
    public get location(): ILocation {
        return this.mLocation;
    }

    private windowId: number = 1;

    constructor(@Inject private app: App, @Inject private jsonService: JsonService) {
        super();
    }

    public alert(message: string, title?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            navigationService.alert(message, title, () => {
                resolve();
            }, (f) => {
                reject(f);
            });
        });
    }
    public confirm(message: string, title?: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            navigationService.confirm(message, title, () => {
                resolve();
            }, (f) => {
                reject(f);
            });
        });
    }

    public async openPage<T>(pageName: string, p?: INameValuePairs): Promise<T> {
        const  url = new AtomUri(pageName);

        if (p) {
            for (const key in p) {
                if (p.hasOwnProperty(key)) {
                    const element = p[key];
                    url.query[key] = element;
                }
            }
        }

        // not supported
        // if (url.protocol && /^tab\:$/i.test(url.protocol)) {
        //     this.app.broadcast(url.host, url.toString());
        //     return;
        // }

        const popup = await AtomViewLoader.loadView(url, this.app);

        const id = `AtomWindow_${this.windowId++}`;

        if (popup.viewModel) {
            popup.viewModel.windowName = id;
        }

        return await new Promise<T>((resolve, reject) => {

            const disposables = new AtomDisposableList();
            disposables.add(popup);

            disposables.add(this.app.subscribe(`atom-window-close:${id}`, (g, i) => {
                disposables.dispose();
                resolve(i);
            }));

            disposables.add(this.app.subscribe(`atom-window-cancel:${id}`, (g, i) => {
                disposables.dispose();
                reject(i || "cancelled");
            }));

            bridge.pushPage(popup, () => {
                resolve(null);
            }, (e) => {
                disposables.dispose();
                reject(e);
            });
        });

    }

    public navigate(url: string): void {
        const  uri = new AtomUri(url);
        this.stack.push(url);
        this.app.runAsync(async () => {
            const popup = await AtomViewLoader.loadView(uri, this.app);
            bridge.setRoot(popup.element);
        });
    }

    public back(): void {
        if (this.stack.length) {
            const url = this.stack.pop();
            this.navigate(url);
        }
    }
}
