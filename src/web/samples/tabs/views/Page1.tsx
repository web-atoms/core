import { App } from "../../../../App.js";
import Bind from "../../../../core/Bind.js";
import { BindableProperty } from "../../../../core/BindableProperty.js";
import XNode from "../../../../core/XNode.js";
import { Inject } from "../../../../di/Inject.js";
import { AtomWindowViewModel } from "../../../../view-model/AtomWindowViewModel.js";
import { AtomGridView } from "../../../controls/AtomGridView.js";
import { AtomListBox } from "../../../controls/AtomListBox.js";
import { MovieService } from "../../MovieService.js";

export default class Page1 extends AtomGridView {
    protected create(): void {

        this.viewModel = this.resolve(Page1ViewModel);

        this.columns = "45%,*,45%";
        this.rows = "45%,*,45%";

        this.render(
        <AtomListBox
            row={1}
            column={1}>
            <AtomListBox.itemTemplate>
                <span text={Bind.oneWay((x) => x.data.label)}></span>
            </AtomListBox.itemTemplate>
        </AtomListBox>);
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
