import { App } from "../../App";
import { BindableProperty } from "../../core/BindableProperty";
import { Inject } from "../../di/Inject";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import MarkdownService from "../services/MarkdownService";
import AtomAlertWindowStyle from "../styles/AtomAlertWindowStyle";
import { AtomControl } from "./AtomControl";
import { AtomWindow } from "./AtomWindow";

export default class AtomAlertWindow extends AtomWindow {

    protected create(): void {
        this.defaultControlStyle =  AtomAlertWindowStyle ;
        this.viewModel = this.resolve(AtomAlertViewModel);

        this.windowTemplate = AtomAlertWindowTemplate;
        this.commandTemplate =  AtomAlertWindowCommandBar;
        // this.bind(this.element, "title", [["viewModel", "title"]]);
    }
}

class AtomAlertWindowTemplate extends AtomControl {

    protected create(): void {
        const div = document.createElement("div");

        this.append(div);

        this.bind(div, "innerHTML", [["viewModel"], ["viewModel", "message"]], false, (vm, m) => vm.markdownToHTML(m) );

    }
}

class AtomAlertWindowCommandBar extends AtomControl {

    protected create(): void {

        const okButton = document.createElement("button");

        const cancelButton = document.createElement("button");
        this.append(okButton);
        this.append(cancelButton);
        this.setPrimitiveValue(okButton, "class", "yes-button" );
        this.setPrimitiveValue(cancelButton, "class", "no-button" );

        this.bind(okButton, "text", [["viewModel", "okTitle"]]);
        this.bind(cancelButton, "text", [["viewModel", "cancelTitle"]]);

        this.bind(okButton, "styleDisplay", [["viewModel", "okTitle"]], false, (v) => v ? "" : "none");
        this.bind(okButton, "styleMarginBottom", [["viewModel", "cancelTitle"]], false, (v) => v ? "0" : "10px");
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

    @Inject
    private ms: MarkdownService;

    public onOkClicked(): void {
        this.close(true);
    }

    public onCancelClicked(): void {
        this.cancel();
    }

    public markdownToHTML(text: string): string {
        return this.ms.toHtml(text);
    }
}
