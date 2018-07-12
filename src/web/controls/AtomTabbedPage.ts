import { App } from "../../App";
import { AtomDisposableList } from "../../core/AtomDisposableList";
import { AtomList } from "../../core/AtomList";
import { AtomOnce } from "../../core/AtomOnce";
import { AtomUri } from "../../core/AtomUri";
import { BindableProperty } from "../../core/BindableProperty";
import { IClassOf, IDisposable, INotifyPropertyChanged } from "../../core/types";
import { Inject } from "../../di/Inject";
import { AtomViewModel, Watch } from "../../view-model/AtomViewModel";
import { AtomUI } from "../core/AtomUI";
import { AtomContentControl } from "./AtomContentControl";
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

    @BindableProperty
    public selectedPage: AtomPage;

    protected preCreate(): void {
        this.element = document.createElement("section");
        const style = this.element.style;
        style.position = "absolute";
        style.left = style.top = style.right = style.bottom = "0";
        this.localViewModel = new AtomTabViewModel(this.app, this);
        this.titleTemplate = TitleItemTemplate;
        this.columns = "*";
        this.rows = "30,*";

        const ul = new AtomItemsControl(this.app, document.createElement("div"));
        this.append(ul);
        ul.setPrimitiveValue(ul.element, "cell", "0,0");
        ul.allowMultipleSelection = false;
        ul.allowSelectFirst = true;
        ul.bind(ul.element, "itemTemplate", [["this", "titleTemplate"]], false, null, this);
        ul.bind(ul.element, "items", [["localViewModel", "pages"]]);
        ul.bind(ul.element, "selectedItem", [["localViewModel", "selectedPage"]], true);

        const presenter = new AtomContentControl(this.app, document.createElement("section"));
        this.append(presenter);
        presenter.setPrimitiveValue(presenter.element, "cell", "0,1");
        presenter.bind(presenter.element, "content", [["localViewModel", "selectedPage"]]);
    }
}

class TitleItemTemplate extends AtomControl {

    protected create(): void {
        this.element = document.createElement("span");
        this.bind(this.element, "text", [["data", "title"]]);

        this.bindEvent(this.element, "click" , (e) => {
            this.localViewModel.selectedPage = this.data;
        });
    }
}

declare var SystemJS: any;

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

        this.bind("selectedUrl", this, [["selectedPage"]], {
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

    protected saveState(v): void {
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
            }).then((v) => {
                // nothing
            });
        }));
    }

    protected async loadPage(message: string, doNotSetSelected: boolean): Promise<AtomPage> {

        const url = new AtomUri(message);

        const pageType = await SystemJS.import(url.path);

        const page: AtomPage = new (pageType.default)(this.app);
        page.title = "Title";
        page.bind(page.element, "title", [["viewModel", "title"]]);
        page.tag = message;
        const vm = page.viewModel;
        if (vm) {
            for (const key in url.query) {
                if (url.query.hasOwnProperty(key)) {
                    const element = url.query[key];
                    vm[key] = element;
                }
            }
        }

        AtomUI.assignID(page.element);
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
            this.pages.remove(page);
        });

        this.saveState(null);
        return page;
    }

}
