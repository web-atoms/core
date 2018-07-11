import { App } from "../../App";
import { AtomDisposableList } from "../../core/AtomDisposableList";
import { AtomList } from "../../core/AtomList";
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
    public tabChannelName: string = "tab";

    @BindableProperty
    public titleTemplate: IClassOf<AtomControl>;

    @BindableProperty
    public selectedPage: AtomPage;

    protected create(): void {
        super.create();

        this.localViewModel = new AtomTabViewModel(this.app, this);

        this.columns = "*";
        this.rows = "30,*";

        const ul = new AtomItemsControl(this.app, document.createElement("ul"));
        this.append(ul);
        ul.setPrimitiveValue(ul.element, "cell", "0,0");
        ul.allowMultipleSelection = false;
        ul.allowSelectFirst = true;
        ul.bind(ul.element, "items", [["viewModel", "pages"]]);
        ul.bind(ul.element, "selectedItem", [["viewModel", "selectedPage"]], true);

        const presenter = new AtomContentControl(this.app, document.createElement("section"));
        this.append(presenter);

        presenter.bind(presenter.element, "content", [["viewModel", "selectedPage"]]);
    }
}

declare var SystemJS: any;

class AtomTabViewModel extends AtomViewModel {

    @BindableProperty
    public pages: AtomList<AtomPage>;

    @BindableProperty
    public selectedPage: AtomPage;

    private oldDisposable: IDisposable;

    constructor(@Inject app: App, private owner: AtomTabbedPage) {
        super(app);
    }

    @Watch
    public watchTabChannel(): void {
        this.watchName(this.owner.tabChannelName);
    }

    protected watchName(name: string): void {
        if (this.oldDisposable) {
            this.oldDisposable.dispose();
            this.oldDisposable = null;
        }
        this.oldDisposable = this.registerDisposable( this.app.subscribe(name, (channel, message) => {
            this.loadPage(message).catch((error) => {
                // tslint:disable-next-line:no-console
                console.error(error);
            }).then((v) => {
                // nothing
            });
        }));
    }

    protected async loadPage(message: string): Promise<any> {

        const url = new AtomUri(message);

        const pageType = await SystemJS.import(url.path);

        const page: AtomPage = new (pageType.default)(this.app);

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

        if (!this.selectedPage) {
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
    }

}
