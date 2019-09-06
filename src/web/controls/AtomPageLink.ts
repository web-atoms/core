import { App } from "../../App";
import { BindableProperty } from "../../core/BindableProperty";
import { NavigationService } from "../../services/NavigationService";
import { AtomControl } from "./AtomControl";

export class AtomPageLink extends AtomControl {

    public page: string;

    public parameters: any;

    constructor(app: App, e?: HTMLElement) {
        super(app, e || document.createElement("span"));
    }

    protected preCreate(): void {

        const navigationService: NavigationService = this.app.resolve(NavigationService);

        this.bindEvent(this.element, "click", (e) => navigationService.openPage(this.page, this.parameters) );
    }

}
