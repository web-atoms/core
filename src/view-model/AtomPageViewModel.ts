import { App } from "../App";
import { BindableProperty } from "../core/BindableProperty";
import { Inject } from "../di/Inject";
import { NavigationService } from "../services/NavigationService";
import { AtomViewModel } from "./AtomViewModel";

export class AtomPageViewModel extends AtomViewModel {

    public pageId: string;

    public closeWarning: string;

    @BindableProperty
    public title: string;

    constructor(
        @Inject app: App,
        @Inject protected navigationService: NavigationService
    ) {
        super(app);
    }

    public async cancel(): Promise<any> {
        if (!this.closeWarning) {
            this.broadcast(`pop-page:${this.pageId}`, null);
            return;
        }
        if ( await this.navigationService.confirm(this.closeWarning, "Are you sure?")) {
            this.broadcast(`pop-page:${this.pageId}`, null);
        }
    }

}
