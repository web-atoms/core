import { App } from "../App";
import { AtomControl } from "../core/AtomComponent";
import { AtomUri } from "../core/AtomUri";
import FormattedString from "../core/FormattedString";
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

export type preNavigateCallback = (
    url: any,
    viewModelParameters: {[key: string]: any},
    options?: IPageOptions) => Promise<any>;

export interface IPageOptions {

    /**
     * target is name of a Frame or AtomTabbedPage component
     * where this window/frame should be loaded.
     */
    target?: string;

    /**
     * If set to true, it will clear the history of the frame
     */
    clearHistory?: boolean;

    /**
     * If you want to cancel the window/frame, you can remove the window by calling cancel on given CancelToken
     */
    cancelToken?: CancelToken;

    /**
     * In mobile application, this will not add chrome/navigation headers on the page
     */
    frameLess?: boolean;

    /**
     * Set to true if you want to open modal window blocking entire app.
     */
    modal?: boolean;

    /** Initializer that will be invoked when page/popup/window is created */
    onInit?: (view: any) => void;
}

declare var UMD: any;

const nameSymbol = UMD.nameSymbol;

function hasPageUrl(target: any): boolean {
    const url = target[nameSymbol];
    if (!url) {
        return false;
    }
    const baseClass = Object.getPrototypeOf(target);
    if (!baseClass) {
        // this is not possible...
        return false;
    }
    return baseClass[nameSymbol] !== url;
}

export abstract class NavigationService {

    private callbacks: navigateCallback[] = [];

    private beforeCallbacks: preNavigateCallback[];

    constructor(public readonly app: App) {

    }

    public abstract alert(message: string | FormattedString, title?: string): Promise<any>;
    public abstract confirm(message: string | FormattedString, title?: string): Promise<boolean>;

    /**
     * This method will open the page, it will not wait for the result
     * @param pageName node style package url or a class
     * @param viewModelParameters key value pair that will be injected on ViewModel when created
     * @param options {@link IPageOptions}
     */
     public pushPage(
        pageName: string | any,
        viewModelParameters?: INameValuePairs,
        options?: IPageOptions) {
        this.app.runAsync(() => this.openPage(pageName, viewModelParameters, options));
    }

    /**
     * This method will open the page and it will wait for result, use pushPage to
     * ignore the result
     * @param pageName node style package url or a class
     * @param viewModelParameters key value pair that will be injected on ViewModel when created
     * @param options {@link IPageOptions}
     */
    public openPage<T>(
        pageName: string | any,
        viewModelParameters?: INameValuePairs,
        options?: IPageOptions): Promise<T> {

        options = options || {};

        if (typeof pageName !== "string") {
            if (hasPageUrl(pageName)) {
                pageName = pageName[nameSymbol] as string;
            } else {
                const rs = this.app.resolve(ReferenceService) as ReferenceService;
                const host = pageName instanceof AtomControl ? "reference" : "class";
                const r = rs.put(pageName);
                pageName = `ref://${host}/${r.key}`;
            }
        }

        if (this.beforeCallbacks) {
            for (const iterator of this.beforeCallbacks) {
                const r = iterator(pageName, viewModelParameters, options);
                if (r) {
                    return r;
                }
            }
        }

        const url = new AtomUri(pageName);
        if (viewModelParameters) {
            for (const key in viewModelParameters) {
                if (viewModelParameters.hasOwnProperty(key)) {
                    const element = viewModelParameters[key];
                    if (element === undefined) {
                        continue;
                    }
                    if (element === null) {
                        url.query["json:" + key] = "null";
                        continue;
                    }
                    if (key.startsWith("ref:") || element instanceof FormattedString) {
                        const r = element instanceof ObjectReference ?
                            element :
                            (this.app.resolve(ReferenceService) as ReferenceService).put(element);
                        url.query[key.startsWith("ref:") ? key : `ref:${key}`] =
                            r.key;
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

    public abstract notify(
        message: string | FormattedString,
        title?: string,
        type?: NotifyType,
        delay?: number
    ): Promise<void>;

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
    public async remove(view: { element: any, viewModel: any }, force?: boolean): Promise<boolean> {
        if (force) {
            this.app.broadcast(`atom-window-cancel:${(view as any).id}`, "cancelled");
            return true;
        }
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

    public registerPreNavigationHook(callback: preNavigateCallback): IDisposable {
        (this.beforeCallbacks ??= []).push(callback);
        return {
            dispose: () => {
                this.beforeCallbacks.remove(callback);
            }
        };
    }

    protected abstract openWindow<T>(url: AtomUri, options: IPageOptions): Promise<T>;

}

// Do not mock Navigation unless you want it in design time..
// Mock.mock(NavigationService, "MockNavigationService");
