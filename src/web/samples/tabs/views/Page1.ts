import { BindableProperty } from "../../../../core/BindableProperty";
import { AtomPageViewModel } from "../../../../view-model/AtomPageViewModel";
import { AtomGridView } from "../../../controls/AtomGridView";

export default class Page1 extends AtomGridView {
    protected create(): void {

        this.viewModel = this.resolve(Page1ViewModel);

        this.columns = "45%,*,45%";
        this.rows = "45%,*,45%";

        const span = document.createElement("span");
        this.append(span);
        // tslint:disable-next-line:no-string-literal
        span["cell"] = "1,1";
        this.bind(span, "text", [["viewModel", "message"]]);
    }
}

class Page1ViewModel extends AtomPageViewModel {

    @BindableProperty
    public message: string;
}
