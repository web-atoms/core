import { BindableProperty } from "../../core/BindableProperty";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import { AtomControl } from "./AtomControl";
import { AtomWindow } from "./AtomWindow";

export default class AtomAlertWindow extends AtomWindow {

    protected create(): void {
        this.element = document.createElement("div");

        this.viewModel = this.resolve(AtomAlertViewModel);

        this.windowTemplate = AtomAlertWindowTemplate;
        this.commandTemplate =  AtomAlertWindowCommandBar;
        // this.bind(this.element, "title", [["viewModel", "title"]]);
    }
}

class AtomAlertWindowTemplate extends AtomControl {

    protected create(): void {
        this.element = document.createElement("div");

        const span = document.createElement("span");

        this.append(span);

        this.bind(span, "text", [["viewModel", "message"]]);

    }
}

class AtomAlertWindowCommandBar extends AtomControl {

    protected create(): void {
        this.element = document.createElement("div");

        const okButton = document.createElement("button");

        const cancelButton = document.createElement("button");

        this.append(okButton);
        this.append(cancelButton);

        this.bind(okButton, "text", [["viewModel", "okTitle"]]);
        this.bind(cancelButton, "text", [["viewModel", "cancelTitle"]]);

        this.bind(okButton, "styleDisplay", [["viewModel", "okTitle"]], false, (v) => v ? "" : "none");
        this.bind(cancelButton, "styleDisplay", [["viewModel", "cancelTitle"]], false, (v) => v ? "" : "none");

        this.bindEvent(okButton, "click", (e) => {
            this.viewModel.onOkClicked();
        });

        this.bindEvent(cancelButton, "click", (e) => {

            this.viewModel.onCancelClicked();
        });
    }
}
class AtomAlertViewModel extends AtomWindowViewModel {

    @BindableProperty
    public title: string;

    @BindableProperty
    public message: string;

    @BindableProperty
    public okTitle: string;

    @BindableProperty
    public cancelTitle: string;

    public onOkClicked(): void {
        this.close(true);
    }

    public onCancelClicked(): void {
        this.cancel();
    }
}
