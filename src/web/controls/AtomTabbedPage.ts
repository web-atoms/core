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

        AtomBinder.refreshValue(this, "selectedPage");
    }

    protected preCreate(): void {

        this.defaultControlStyle = AtomTabbedPageStyle;
        this.element = document.createElement("section");
        const style = this.element.style;
        style.position = "absolute";
        style.left = style.top = style.right = style.bottom = "0";
        this.localViewModel = new AtomTabViewModel(this.app, this);
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
        (this.presenter as any).row = "1";

        this.bind(this.element, "selectedPage", [["localViewModel", "selectedPage"]]);

        const ws = this.app.resolve(NavigationService) as WindowService;

        this.registerDisposable(ws.registerHostForWindow((e) => this.getParentHost(e)));

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
                    [tabItem]: true,
                    [selectedTabItem]: data === selectedPage
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

    private oldDisposable: IDisposable;

    private pageUpdater = new AtomOnce();

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

        this.watchTabChannel();
        // this.watchSelectedPage();
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
            const page = await this.loadPage(iterator, true);
            if (page.tag === urlState.selectedUrl) {
                this.pageUpdater.run(() => {
                    this.selectedPage = page;
                });
            }
        }

        if (!this.selectedPage) {
            this.selectedPage = this.pages[0];
        }
    }

    @Watch
    public watchTabChannel(): void {
        this.watchName(this.owner.tabChannelName);
    }

    @Watch
    public watchSelectedPage(): void {
        this.saveState(this.selectedPage);
    }

    public closePage(page: AtomPage): void {
        this.app.runAsync(async () => {
            const vm = page.viewModel as AtomWindowViewModel;
            if (vm && vm.cancel) {
                await vm.cancel();
            } else {
                this.app.broadcast(`atom-window-cancel:${page.element.id}`, null);
            }
        });
    }

    protected saveState(a?: any): void {
        const state: ITabState = {
            urls: this.pages.map((p) => p.tag),
            selectedUrl: this.selectedUrl,
        };
        sessionStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    protected watchName(name: string): void {
        this.bindUrlParameter("selectedUrl", name);
        if (this.oldDisposable) {
            this.oldDisposable.dispose();
            this.oldDisposable = null;
        }
        this.oldDisposable = this.registerDisposable( this.app.subscribe(name, (channel, message) => {
            this.loadPage(message, false).catch((error) => {
                // tslint:disable-next-line:no-console
                console.error(error);
            }).then(() => {
                // do nothing
            });
        }));
    }

    protected async loadPage(message: string, doNotSetSelected: boolean): Promise<AtomPage> {

        const url = new AtomUri(message);

        // const popupType = await UMD.resolveViewClassAsync(url.path);
        // const page: AtomPage = (new (popupType)(this.app)) as AtomPage;
        const page = await AtomLoader.loadView<AtomPage>(url, this.app);
        AtomUI.assignID(page.element);
        page.title = "Title";
        page.tag = message;
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

        const disposables = new AtomDisposableList();

        disposables.add( this.app.subscribe(`atom-window-close:${page.element.id}`, () => {
            disposables.dispose();
        }));
        disposables.add( this.app.subscribe(`atom-window-cancel:${page.element.id}`, () => {
            disposables.dispose();
        }));

        disposables.add(() => {
            const index = this.pages.indexOf(page);
            if (this.pages.length <= 1 && index <= 0) {
                return;
            }
            this.pages.remove(page);
            const pe = page.element.parentElement;
            page.dispose();
            if (pe) {
                pe.remove();
            }
            if (this.selectedPage === page) {
                this.selectedPage = this.pages[index - 1];
            }
        });

        this.saveState();
        return page;
    }

}
