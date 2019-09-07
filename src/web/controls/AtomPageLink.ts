import { App } from "../../App";
import { BindableProperty } from "../../core/BindableProperty";
import { CancelToken } from "../../core/types";
import { IPageOptions, NavigationService } from "../../services/NavigationService";
import { AtomControl } from "./AtomControl";

export class AtomPageLink extends AtomControl {

    public page: string;

    public parameters: any;

    public allowMultiple: boolean;

    public isOpen: boolean;

    public cancelToken: CancelToken;

    public options: IPageOptions;

    public modal: boolean;

    public cancelIfOpen: boolean;

    constructor(app: App, e?: HTMLElement) {
        super(app, e || document.createElement("span"));
    }

    public preCreate(): void {

        this.page = null;

        this.parameters = null;

        this.isOpen = false;

        this.options = null;

        super.preCreate();

        this.bindEvent(
            this.element,
            "click",
            () => {
                if (this.modal) {
                    return this.openPopup();
                }
                return this.app.runAsync(() => this.openPopup());
            });

        this.bind(
            this.element,
            "styleClass",
            [["this", "isOpen"]],
            false ,
            (v) => ({
                [this.controlStyle.root]: 1,
                "is-open": v
            }),
            this);
    }

    protected async openPopup(): Promise<void> {

        if (this.cancelToken) {
            if (this.cancelIfOpen) {
                this.cancelToken.cancel();
                this.cancelToken = null;
                this.isOpen = false;
                return;
            } else {
                this.cancelToken.dispose();
            }
        }

        this.cancelToken = new CancelToken();

        try {
            const navigationService = this.app.resolve(NavigationService) as NavigationService;
            const pt = this.page;
            if (!pt) {
                // tslint:disable-next-line:no-console
                console.error("No popup template specified in PopupButton");
                return;
            }
            this.isOpen = true;
            const o = this.options ?
                { ... this.options, cancelToken: this.cancelToken } :
                { cancelToken: this.cancelToken };
            const result = await navigationService.openPage(pt, this.parameters, o);

            this.element.dispatchEvent(new CustomEvent("result", { detail: result }));

        } catch (e) {
            this.element.dispatchEvent(new CustomEvent("error", { detail: e }));
        } finally {
            this.cancelToken = null;
            this.isOpen = false;
        }
    }

}
