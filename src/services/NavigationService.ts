import { App } from "../App";
import { AtomComponent } from "../core/AtomComponent";
import { AtomUri } from "../core/AtomUri";
import { ArrayHelper, CancelToken, IDisposable, INameValuePairs } from "../core/types";
import ReferenceService, { ObjectReference } from "./ReferenceService";

// export interface ILocation {
//     href?: string;
//     hash?: INameValues;
//     host?: string;
//     hostName?: string;
//     port?: string;
//     protocol?: string;
// }

export enum NotifyType {
    Information = "info",
    Warning = "warn",
    Error = "error"
}

export type navigateCallback = (
    url: AtomUri,
    options?: IPageOptions) => Promise<any>;

export interface IPageOptions {
    target?: string;
    clearHistory?: boolean;
    cancelToken?: CancelToken;
}

export abstract class NavigationService {

    private callbacks: navigateCallback[] = [];

    constructor(public readonly app: App) {

    }

    public abstract alert(message: string, title?: string): Promise<any>;
    public abstract confirm(message: string, title?: string): Promise<boolean>;

    /**
     *
     * @param pageName url
     * @param p parameters
     * @param options target, clearHistory, cancelToken
     */
    public openPage<T>(
        pageName: string,
        p?: INameValuePairs,
        options?: IPageOptions): Promise<T> {
        const url = new AtomUri(pageName);
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
                            (this.app.resolve(ReferenceService) as ReferenceService).put(element);
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
        for (const iterator of this.callbacks) {
            const r = iterator(url, options);
            if (r) {
                return r;
            }
        }
        return this.openWindow(url, options);
    }

    public abstract notify(message: string, title?: string, type?: NotifyType, delay?: number): void;

    public abstract get title(): string;
    public abstract set title(v: string);

    public abstract get location(): AtomUri;
    public abstract set location(v: AtomUri);

    public abstract navigate(url: string): void;

    public abstract back(): void;

    public abstract refresh(): void;

    /**
     * Sends signal to remove window/popup/frame, it will not immediately remove, because
     * it will identify whether it can remove or not by displaying cancellation warning. Only
     * if there is no cancellation warning or user chooses to force close, it will not remove.
     * @param id id of an element
     * @returns true if view was removed successfully
     */
    public async remove(view: { element: any, viewModel: any }): Promise<boolean> {
        const vm = view.viewModel;
        if (vm && vm.cancel) {
            const a = await vm.cancel();
            return a;
        }
        this.app.broadcast(`atom-window-cancel:${(view as any).id}`, "cancelled");
        return true;
    }

    public registerNavigationHook(callback: navigateCallback): IDisposable {
        this.callbacks.push(callback);
        return {
            dispose: () => {
                ArrayHelper.remove(this.callbacks, (a) => a === callback);
            }
        };
    }

    protected abstract openWindow<T>(url: AtomUri, options: IPageOptions): Promise<T>;

}

// Do not mock Navigation unless you want it in design time..
// Mock.mock(NavigationService, "MockNavigationService");
