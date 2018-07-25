import { App } from "../../../../App";
import { BindableProperty } from "../../../../core/BindableProperty";
import { Inject } from "../../../../di/Inject";
import { AtomWindowViewModel } from "../../../../view-model/AtomWindowViewModel";
import { AtomGridView } from "../../../controls/AtomGridView";
import { AtomListBox } from "../../../controls/AtomListBox";
import { MovieService } from "../../MovieService";

export default class Page1 extends AtomGridView {
    protected create(): void {

        this.viewModel = this.resolve(Page1ViewModel);

        this.columns = "45%,*,45%";
        this.rows = "45%,*,45%";

        const div = new AtomListBox(this.app, document.createElement("div"));
        this.append(div);
        // tslint:disable-next-line:no-string-literal
        div.element["row"] = "1";
        // tslint:disable-next-line:no-string-literal
        div.element["column"] = "1";
        div.bind(div.element, "items", [["viewModel", "items"]]);
    }
}

class Page1ViewModel extends AtomWindowViewModel {

    @BindableProperty
    public message: string;

    @BindableProperty
    public items: any;

    constructor(
        @Inject app: App,
        @Inject public readonly movieService: MovieService
    ) {
        super(app);
    }

    public async init(): Promise<any> {
        this.items = await this.movieService.countryList();
        this.closeWarning = "Are you sure you want to close this?";
    }
}
