import { AtomWindowViewModel } from "../view-model/AtomWindowViewModel";
import { AtomControl } from "./AtomControl";
import { AtomTemplate } from "./AtomTemplate";
import { AtomWindow } from "./AtomWindow";

export class AtomAlertWindow extends AtomWindow {

    protected create(): void {
        this.element = document.createElement("div");

        this.windowTemplate = AtomAlertWindowTemplate;
        this.commandTemplate =  AtomAlertWindowCommandBar;
        this.bind(this.element, "title", [["viewModel", "title"]]);
        this.init();
    }
}

class AtomAlertWindowTemplate extends AtomControl {

    protected create(): void {
        this.element = document.createElement("div");

        const span = document.createElement("span");

        this.append(span);

        this.bind(span, "text", [["viewModel", "message"]]);

        this.init();
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

        this.bindEvent(okButton, "click", (e) => {

            this.viewModel.onOkClicked();
        });

        this.bindEvent(cancelButton, "click", (e) => {

            this.viewModel.onCancelClicked();
        });

        this.init();
    }
}
