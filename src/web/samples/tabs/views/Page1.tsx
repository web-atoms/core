import { App } from "../../../../App";
import Bind from "../../../../core/Bind";
import { BindableProperty } from "../../../../core/BindableProperty";
import XNode from "../../../../core/XNode";
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
