import { App } from "../../App";
import Bind from "../../core/Bind";
import { BindableProperty } from "../../core/BindableProperty";
import FormattedString from "../../core/FormattedString";
import XNode from "../../core/XNode";
import { Inject } from "../../di/Inject";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import MarkdownService from "../services/MarkdownService";
import AtomAlertWindowStyle from "../styles/AtomAlertWindowStyle";
import { AtomControl } from "./AtomControl";
import { AtomWindow } from "./AtomWindow";

export default class AtomAlertWindow extends AtomWindow {

    public viewModel: AtomAlertViewModel;

    protected create(): void {
        this.defaultControlStyle =  AtomAlertWindowStyle ;
        this.viewModel = this.resolve(AtomAlertViewModel);

        // this.windowTemplate = AtomAlertWindowTemplate;
        // this.commandTemplate =  AtomAlertWindowCommandBar;
        // this.bind(this.element, "title", [["viewModel", "title"]]);

        this.render(<AtomWindow
            title={Bind.oneWay(() => this.viewModel.title)}>
            <AtomWindow.windowTemplate>
                <div formattedText={Bind.oneWay(() => this.viewModel.message)}></div>
            </AtomWindow.windowTemplate>
            <AtomWindow.commandTemplate>
                <div>
                    <button
                        class="yes-button"
                        styleDisplay={Bind.oneWay(() => this.viewModel.okTitle ? "" : "none")}
                        text={Bind.oneWay(() => this.viewModel.okTitle)}
                        eventClick={() => this.viewModel.onOkClicked()}/>
                    <button
                        class="no-button"
                        styleMarginBottom={Bind.oneWay(() => this.viewModel.cancelTitle ? "0" : "10px")}
                        styleDisplay={Bind.oneWay(() => this.viewModel.cancelTitle ? "" : "none")}
                        text={Bind.oneWay(() => this.viewModel.cancelTitle)}
                        eventClick={() => this.viewModel.onCancelClicked()}/>
                </div>
            </AtomWindow.commandTemplate>
        </AtomWindow>);
    }
}

// class AtomAlertWindowTemplate extends AtomControl {

//     protected create(): void {
//         const div = document.createElement("div");

//         this.append(div);

//         this.bind(div, "formattedText", [["viewModel", "message"]]);

//     }
// }

// class AtomAlertWindowCommandBar extends AtomControl {

//     protected create(): void {

//         const okButton = document.createElement("button");

//         const cancelButton = document.createElement("button");
//         this.append(okButton);
//         this.append(cancelButton);
//         this.setPrimitiveValue(okButton, "class", "yes-button" );
//         this.setPrimitiveValue(cancelButton, "class", "no-button" );

//         this.bind(okButton, "text", [["viewModel", "okTitle"]]);
//         this.bind(cancelButton, "text", [["viewModel", "cancelTitle"]]);

//         this.bind(okButton, "styleDisplay", [["viewModel", "okTitle"]], false, (v) => v ? "" : "none");
//         this.bind(okButton, "styleMarginBottom", [["viewModel", "cancelTitle"]], false, (v) => v ? "0" : "10px");
//         this.bind(cancelButton, "styleDisplay", [["viewModel", "cancelTitle"]], false, (v) => v ? "" : "none");

//         this.bindEvent(okButton, "click", (e) => {
//             this.viewModel.onOkClicked();
//         });

//         this.bindEvent(cancelButton, "click", (e) => {

//             this.viewModel.onCancelClicked();
//         });
//     }
// }
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
