import { Atom } from "../../Atom";
import { AtomBinder } from "../../core/AtomBinder";
import { AtomDispatcher } from "../../core/AtomDispatcher";
import { AtomLoader } from "../../core/AtomLoader";
import { AtomUri } from "../../core/AtomUri";
import { BindableProperty } from "../../core/BindableProperty";
import { IClassOf, IDisposable, INotifyPropertyChanged } from "../../core/types";
import { NavigationService } from "../../services/NavigationService";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import { AtomUI } from "../core/AtomUI";
import { WindowService } from "../services/WindowService";
import AtomFrameStyle from "../styles/AtomFrameStyle";
import { AtomControl } from "./AtomControl";

export interface IPageItem {
    url: string;
    page: AtomControl;
    scrollY: number;
}

/**
 * Creates and hosts an instance of AtomControl available at given URL. Query string parameters
 * from the url will be passed to view model as initial property values.
 *
 * By default stack is turned off, so elements and controls will be destroyed when new control is hosted.
 */
export class AtomFrame
    extends AtomControl
    implements INotifyPropertyChanged {

    public stack: IPageItem[] = [];

    public get canGoBack(): boolean {
        return this.stack.length ? true : false;
    }

    public name: string;

    @BindableProperty
    public keepStack: boolean = false;

    @BindableProperty
    public current: AtomControl = null;

    public pagePresenter: HTMLElement;

    public currentDisposable: IDisposable = null;

    public backCommand: () => void;

    public saveScrollPosition: boolean = false;

    private mUrl: string;
    public get url(): string {
        return this.mUrl;
    }
    public set url(value: string) {
        if (this.mUrl === value) {
            return;
        }
        if (value === undefined) {
            return;
        }
        this.runAfterInit(() => {
            this.app.runAsync(() => this.loadForReturn(value === null ? null : new AtomUri(value), true));
        });
    }

    private navigationService: WindowService;

    public async onBackCommand(): Promise<void> {
        if (!this.stack.length) {
            // tslint:disable-next-line: no-console
            console.warn(`FrameStack is empty !!`);
            return;
        }

        const ctrl: AtomControl = this.current;
        if (ctrl) {
            await this.navigationService.remove(ctrl);
        }

        // this.popStack();
    }

    public popStack(): void {
        if (!this.stack.length) {
            // tslint:disable-next-line: no-console
            console.warn(`FrameStack is empty !!`);
            return;
        }
        const last = this.stack.pop();
        this.current = last.page;
        (this.current.element as HTMLElement).style.display = "";
        this.setUrl(last.url);
        if (this.saveScrollPosition) {
            setTimeout(() => {
                window.scrollTo(0, last.scrollY);
            }, 200);
        }
    }

    public canChange(): Promise<boolean> {
        const c = this.current;
        if (!c) {
            return Promise.resolve(true);
        }
        return this.navigationService.remove(c);
    }

    public push(ctrl: AtomControl): void {

        if (this.current) {
            if (this.keepStack) {
                (this.current.element as HTMLElement).style.display = "none";
                this.stack.push({
                    url: (this.current as any)._$_url ,
                    page: this.current,
                    scrollY: this.navigationService.screen.scrollTop
                });
            } else {
                if (this.current === ctrl) {
                    return;
                }
                const c1: AtomControl = this.current;
                const e1: HTMLElement = c1.element as HTMLElement;
                if (e1) {
                    this.navigationService.remove(c1);
                }
            }
        }

        const element: HTMLElement = ctrl.element as HTMLElement;
        const e = this.pagePresenter || this.element;
        (e).appendChild(element);

        this.current = ctrl;

        if (this.saveScrollPosition) {
            window.scrollTo(0, 0);
        }
    }

    public async load(url: AtomUri, clearHistory?: boolean): Promise<AtomControl> {

        // we will not worry if we cannot close the page or not
        // as we are moving in detail view, we will come back to page
        // without loosing anything

        if (clearHistory) {
            if (! await this.canChange()) {
                return;
            }
        }

        const { view, disposables } =
            await AtomLoader.loadView<AtomControl>(url, this.app, true, () => new AtomWindowViewModel(this.app));
        const urlString = url.toString();
        (view as any)._$_url = urlString;

        this.push(view);

        const e = view.element;

        this.setUrl(urlString);
        disposables.add(view);
        disposables.add({
            dispose: () => {
                e.innerHTML = "";
                e.remove();
                this.popStack();
            }
        });
        return view;
    }

    public toUpperCase(s: string): string {
        return s.split("-")
            .filter((t) => t)
            .map((t) => t.substr(0, 1).toUpperCase() + t.substr(1))
            .join("");
    }

    protected setUrl(urlString: string) {
        this.mUrl = urlString;
        AtomBinder.refreshValue(this, "url");
        AtomBinder.refreshValue(this, "canGoBack");
    }

    protected async loadForReturn(url: AtomUri, clearHistory?: boolean): Promise<any> {
        const hasHistory = this.keepStack;
        this.keepStack = !clearHistory;

        if (url === null) {
            if (hasHistory && clearHistory) {
                this.clearStack();
            }
            return;
        }

        const page = await this.load(url, clearHistory);
        if (hasHistory) {
            if (clearHistory) {
                this.clearStack();
            }
        }
        try {
            return await (page as any).returnPromise;
        } catch (ex) {
            // this will prevent warning in chrome for unhandled exception
            if ((ex.message ? ex.message : ex) === "cancelled") {
                // tslint:disable-next-line: no-console
                console.warn(ex);
                return;
            }
            // throw new Error( ex.stack ? (ex + "\r\n" + ex.stack ) : ex);
            throw ex;
        }
    }

    protected clearStack(): void {
        // clear stack... irrespective of cancellation !!
        for (const iterator of this.stack) {
            const e = iterator.page.element;
            if (e) {
                iterator.page.dispose();
                e.innerHTML = "";
                e.remove();
            }
        }
        this.stack.length = 0;
    }

    protected preCreate(): void {
        this.name = null;
        this.navigationService = this.app.resolve(NavigationService);
        this.defaultControlStyle = AtomFrameStyle;
        this.pagePresenter = null;
        if (!this.element) {
            this.element = document.createElement("section");
        }
        AtomUI.assignID(this.element);
        this.runAfterInit(() => {
            this.setPrimitiveValue(this.element, "styleClass", this.controlStyle.root);
        });
        this.backCommand = () => this.app.runAsync(() => this.onBackCommand());

        // hook navigation...

        const d = this.navigationService.registerNavigationHook((url, {
            target,
            clearHistory,
            cancelToken }) => {
            if (
                target !== this.name
                && target !== "frame"
                && url.protocol !== "frame:") {
                return undefined;
            }
            if (cancelToken) {
                cancelToken.registerForCancel(() => {
                    this.backCommand();
                });
            }
            return this.loadForReturn(url, clearHistory);
        });
        this.registerDisposable(d);
    }
}
