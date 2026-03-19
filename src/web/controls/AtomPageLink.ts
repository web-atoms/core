import { App } from "../../App.js";
import { BindableProperty } from "../../core/BindableProperty.js";
import { CancelToken, IClassOf } from "../../core/types.js";
import XNode from "../../core/XNode.js";
import { IPageOptions, NavigationService } from "../../services/NavigationService.js";
import AtomPageLinkStyle from "../styles/AtomPageLinkStyle.js";
import { AtomStyle } from "../styles/AtomStyle.js";
import { IStyleDeclaration } from "../styles/IStyleDeclaration.js";
import { AtomControl } from "./AtomControl.js";

export class AtomPageLink extends AtomControl {

    public static page = XNode.prepare("page", true, true);

    public page: string | IClassOf<AtomControl>;

    public parameters: any;

    public isOpen: boolean;

    public cancelToken: CancelToken;

    public options: IPageOptions;

    /**
     * Fired after the result was received from popup/window successfully
     */
    public eventResult: any;

    /**
     * Fired after popup/window was cancelled
     */
    public eventError: any;

    /**
     * Fired before opening popup/window.
     * In the event's detail object, you must set parameters property as shown below...
     * eventGetParameters={Bind.event((e) => e.detail.parameters = ({}))}
     */
    public eventGetParameters: any;

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

        this.defaultControlStyle = AtomPageLinkStyle;

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
                [this.controlStyle.name]: 1,
                "is-open": v,
                "atom-page-link": 1
            }),
            this);

        this.registerDisposable({
            dispose: () => {
                const ct = this.cancelToken;
                if (ct) {
                    ct.cancel();
                }
            }
        });
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

        let o: IPageOptions = null;

        try {
            const navigationService = this.app.resolve(NavigationService) as NavigationService;
            const pt = this.page;
            if (!pt) {
                // tslint:disable-next-line:no-console
                console.error("No popup template specified in PopupButton");
                return;
            }
            this.isOpen = true;
            o = this.options ?
                { ... this.options, cancelToken: this.cancelToken } :
                { cancelToken: this.cancelToken };

            o.onInit = (view: AtomControl) => {
                view.setLocalValue(view.element, "styleClass", `${this.controlStyle.name} page` );
            };

            const getParametersEvent = new CustomEvent("getParameters", { detail: {} as any});

            this.element.dispatchEvent(getParametersEvent);

            const p =  getParametersEvent.detail.parameters || this.parameters;

            const result = await navigationService.openPage(pt, p, o);

            this.element.dispatchEvent(new CustomEvent("result", { detail: result }));

        } catch (e) {
            // if element is disposed or null, ignore
            if (this.element) {
                this.element.dispatchEvent(new CustomEvent("error", { detail: e }));
            }
        } finally {
            this.cancelToken = null;
            this.isOpen = false;
            if (o) { o.onInit = null; }
        }
    }

}
