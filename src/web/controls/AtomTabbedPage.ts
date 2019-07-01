import { App } from "../../App";
import { AtomBinder } from "../../core/AtomBinder";
import { AtomDisposableList } from "../../core/AtomDisposableList";
import { AtomList } from "../../core/AtomList";
import { AtomLoader } from "../../core/AtomLoader";
import { AtomOnce } from "../../core/AtomOnce";
import { AtomUri } from "../../core/AtomUri";
import { BindableProperty } from "../../core/BindableProperty";
import { IClassOf, IDisposable, INotifyPropertyChanged } from "../../core/types";
import { Inject } from "../../di/Inject";
import { NavigationService } from "../../services/NavigationService";
import { AtomViewModel, Watch } from "../../view-model/AtomViewModel";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import { AtomUI } from "../core/AtomUI";
import { WindowService } from "../services/WindowService";
import { AtomTabbedPageStyle } from "../styles/AtomTabbedPageStyle";
import { AtomControl } from "./AtomControl";
import { AtomGridView } from "./AtomGridView";
import { AtomItemsControl } from "./AtomItemsControl";
import { AtomPage } from "./AtomPage";

export class AtomTabbedPage extends AtomGridView
    implements INotifyPropertyChanged {

    @BindableProperty
    public tabChannelName: string = "app";

    @BindableProperty
    public titleTemplate: IClassOf<AtomControl>;

    public presenter: HTMLElement;

    private mWindowService: WindowService;
    protected get windowService(): WindowService {
        return this.mWindowService || (this.mWindowService = this.resolve(WindowService));
    }

    private mSelectedPage: AtomPage;
    public get selectedPage(): AtomPage {
        return this.mSelectedPage;
    }
    public set selectedPage(value: AtomPage) {
        this.mSelectedPage = value;

        if (value && value.element) {
            const pe = value.element.parentElement;
            if (!pe || pe.parentElement !== this.presenter) {
                const p = document.createElement("div");
                const s = p.style;
                p.className = "page-host";
                s.position = "absolute";
                s.left = s.right = s.top = s.bottom = "0";
                p.appendChild(value.element);
                this.presenter.appendChild(p);
                const ve = value;

                value.bind(p,
                    "styleDisplay",
                    [["this", "selectedPage"]], false, (v) => v === ve ? "" : "none", this);
            }
        }

        this.invalidate();

        this.windowService.currentTarget = value.element;

        AtomBinder.refreshValue(this, "selectedPage");
    }

    protected preCreate(): void {

        this.defaultControlStyle = AtomTabbedPageStyle;
        this.element = document.createElement("section");
        this.runAfterInit(() => {
            this.setPrimitiveValue(this.element, "styleClass", this.controlStyle.root);
        });
        this.localViewModel = this.resolve(AtomTabViewModel, () => ({ owner: this }));
        this.titleTemplate = TitleItemTemplateCreator(this);
        this.columns = "*";
        this.rows = "30,*";

        const ul = new AtomItemsControl(this.app, document.createElement("div"));
        this.append(ul);
        ul.allowMultipleSelection = false;
        ul.allowSelectFirst = true;
        ul.bind(ul.element, "itemTemplate", [["this", "titleTemplate"]], false, null, this);
        ul.bind(ul.element, "items", [["localViewModel", "pages"]]);
        ul.bind(ul.element, "selectedItem", [["localViewModel", "selectedPage"]], true);

        // const presenter = new AtomContentControl(this.app, document.createElement("section"));
        // this.append(presenter);
        // presenter.setPrimitiveValue(presenter.element, "row", "1");
        // presenter.bind(presenter.element, "content", [["localViewModel", "selectedPage"]]);

        this.presenter = document.createElement("div");
        this.append(this.presenter);
        this.presenter.classList.add("presenter");
        (this.presenter as any).row = "1";

        this.bind(this.element, "selectedPage", [["localViewModel", "selectedPage"]]);

        this.registerDisposable(this.windowService.registerHostForWindow((e) => this.getParentHost(e)));

    }

    private getParentHost(e: HTMLElement): HTMLElement {
        const pe = e._logicalParent || e.parentElement;
        if (pe === this.presenter) {
            return e;
        }
        if (!pe) {
            return null;
        }
        return this.getParentHost(pe);
    }
}

// tslint:disable-next-line:variable-name
function TitleItemTemplateCreator(__creator: any): IClassOf<AtomControl> {
    return class TitleItemTemplate extends AtomControl {

        protected create(): void {

            this.element = document.createElement("div");
            // this.bind(this.element, "text", [["data", "title"]]);
            this.bind(this.element, "styleClass", [
                    ["data"],
                    ["localViewModel", "selectedPage"],
                    ["this", "controlStyle", "tabItem"],
                    ["this", "controlStyle", "selectedTabItem"]
                ],
                false,
                (data, selectedPage, tabItem, selectedTabItem) => ({
                    [tabItem.className]: true,
                    [selectedTabItem.className]: data === selectedPage
                }),
                __creator);

            const divTitle = document.createElement("div");
            this.append(divTitle);

            this.bind(divTitle, "text", [["data", "title"]]);

            const closeButton = document.createElement("img");
            this.bind(closeButton, "styleClass", [["this", "controlStyle", "closeButton"]], false, null, __creator);
            // closeButton.textContent = "x";
            this.append(closeButton);

            this.bindEvent(closeButton, "click", () => __creator.localViewModel.closePage(this.data));

            this.bindEvent(divTitle, "click" , () => {
                this.localViewModel.selectedPage = this.data;
            });
        }
    };
}

// declare class UMD {
//     public static resolveViewClassAsync(path: string): Promise<IClassOf<AtomControl>>;
// }

interface ITabState {
    urls: string[];
    selectedUrl: string;
}

class AtomTabViewModel extends AtomViewModel {

    @BindableProperty
    public pages: AtomList<AtomPage>;

    @BindableProperty
    public selectedPage: AtomPage;

    @BindableProperty
    public selectedUrl: string;

    public channel: string;

    public storageKey: string;

    @BindableProperty
    public tabState: ITabState;

    private pageUpdater = new AtomOnce();

    @Inject
    private navigationService: NavigationService;

    constructor(@Inject app: App, private owner: AtomTabbedPage) {
        super(app);

        this.pages = new AtomList();

        this.bind(this, "selectedUrl", this, [["selectedPage"]], {
            fromSource: (v: any): any => {
                return v.tag;
            },
            fromTarget: (v: any): any => {
                if (!this.pages) {
                    return null;
                }
                return this.pages.find((p) => p.tag === v);
            }
        });

        this.bindUrlParameter("selectedUrl", "url");

    }

    public async init(): Promise<any> {

        const ch = this.owner.tabChannelName;
        this.storageKey = `${this.app.contextId}_${ch}`;

        const urls = sessionStorage.getItem(this.storageKey) || "null";
        const urlState: ITabState = JSON.parse(urls) || {
            name,
            urls: [],
            selectedUrl: null
        };
        for (const iterator of urlState.urls) {
            const page = await this.loadPage(new AtomUri(iterator), true);
            if (page.tag === urlState.selectedUrl) {
                this.pageUpdater.run(() => {
                    this.selectedPage = page;
                });
            }
        }

        if (!this.selectedPage) {
            this.selectedPage = this.pages[0];
        }

        const d = this.navigationService.registerNavigationHook(
            (uri, target) => {
                if (
                    target === this.owner.tabChannelName ||
                    (uri.protocol === "tab:" && uri.host === this.owner.tabChannelName)) {
                    return this.loadPageForReturn(uri);
                }
            }
        );
        this.registerDisposable(d);
    }

    @Watch
    public watchSelectedPage(): void {
        this.saveState(this.selectedPage);
    }

    public closePage(page: AtomPage): void {
        this.app.runAsync(() => this.navigationService.remove(page));
    }

    protected saveState(a?: any): void {
        const state: ITabState = {
            urls: this.pages.map((p) => p.tag),
            selectedUrl: this.selectedUrl,
        };
        sessionStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    protected async loadPageForReturn(url: AtomUri): Promise<any> {
        const p = await this.loadPage(url, false);
        try {
            return await (p as any).returnPromise;
        } catch (ex) {
            // this will prevent warning in chrome for unhandled exception
            if ((ex.message ? ex.message : ex) === "cancelled") {
                // tslint:disable-next-line: no-console
                console.warn(ex);
                return;
            }
            throw ex;
        }
    }

    protected async loadPage(
        url: AtomUri,
        doNotSetSelected: boolean): Promise<AtomPage> {

        const uriString = url.toString();

        const existing = this.pages.find((x) => x.tag === uriString);
        if (existing) {
            if (!doNotSetSelected) {
                if (this.selectedPage !== existing) {
                    this.selectedPage = existing;
                }
            }
            return existing;
        }

        // const popupType = await UMD.resolveViewClassAsync(url.path);
        // const page: AtomPage = (new (popupType)(this.app)) as AtomPage;
        const { view: page, disposables } =
            await AtomLoader.loadView<AtomPage>(url, this.app, true, () => new AtomWindowViewModel(this.app));
        AtomUI.assignID(page.element);
        page.title = "Title";
        page.tag = uriString;
        const vm = page.viewModel;
        if (vm) {
            vm.windowName = page.element.id;
        }

        if (url.query && url.query.title) {
            page.title = url.query.title.toString();
        }

        page.bind(page.element, "title", [["viewModel", "title"]]);

        page.bind(page.element,
            "styleDisplay",
            [["this", "selectedPage"]],
            false,
            (v) => v === page ? "" : "none", this);

        this.pages.add(page);

        if (!doNotSetSelected) {
            this.selectedPage = page;
        }

        const e = page.element;

        disposables.add(() => {
            const index = this.pages.indexOf(page);
            if (this.pages.length <= 1 && index <= 0) {
                return;
            }
            this.pages.remove(page);
            const pe = e.parentElement;
            if (pe) {
                pe.remove();
            }
            e.innerHTML = "";
            e.remove();
            if (this.selectedPage === page) {
                this.selectedPage = this.pages[index - 1];
            }
        });

        disposables.add(page);

        this.saveState();
        return page;
    }

}
