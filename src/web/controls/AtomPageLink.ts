import { App } from "../../App";
import { BindableProperty } from "../../core/BindableProperty";
import { CancelToken, IClassOf } from "../../core/types";
import { IPageOptions, NavigationService } from "../../services/NavigationService";
import { AtomStyle } from "../styles/AtomStyle";
import { IStyleDeclaration } from "../styles/IStyleDeclaration";
import { AtomControl } from "./AtomControl";

class EmptyStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {};
    }
}

export class AtomPageLink extends AtomControl {

    public page: string | IClassOf<AtomControl>;

    public parameters: any;

    public isOpen: boolean;

    public cancelToken: CancelToken;

    public options: IPageOptions;

    /**
     * Block opening Popup/Page again till the opened page is closed or cancelled.
     * If set true, toggle will not work. Default is false.
     */
    public modal: boolean;

    /**
     * Setting Toggle (default true) true will close the already opened Popup/window, otherwise it will
     * open a new window if Modal is false.
     */
    public toggle: boolean;

    constructor(app: App, e?: HTMLElement) {
        super(app, e || document.createElement("span"));
    }

    public preCreate(): void {

        this.page = null;

        this.parameters = null;

        this.isOpen = false;

        this.options = null;

        this.modal = false;

        this.toggle = true;

        this.defaultControlStyle = EmptyStyle;

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
            if (this.toggle) {
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

            const getParametersEvent = new CustomEvent("beforeStart", { detail: undefined });

            this.element.dispatchEvent(getParametersEvent);

            const p = getParametersEvent.detail || this.parameters;

            const result = await navigationService.openPage(pt, p, o);

            this.element.dispatchEvent(new CustomEvent("result", { detail: result }));

        } catch (e) {
            this.element.dispatchEvent(new CustomEvent("error", { detail: e }));
        } finally {
            this.cancelToken = null;
            this.isOpen = false;
        }
    }

}
