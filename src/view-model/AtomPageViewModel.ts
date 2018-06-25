import { App } from "../App";
import { Inject } from "../di/Inject";
import { WindowService } from "../services/WindowService";
import { AtomViewModel } from "./AtomViewModel";

export class AtomPageViewModel extends AtomViewModel {

    public pageId: string;

    public closeWarning: string;

    constructor(
        @Inject app: App,
        @Inject protected windowService: WindowService
    ) {
        super(app);
    }

    public async cancel(): Promise<any> {
        if (!this.closeWarning) {
            this.broadcast(`pop-page:${this.pageId}`, null);
            return;
        }
        if ( await this.windowService.confirm(this.closeWarning, "Are you sure?")) {
            this.broadcast(`pop-page:${this.pageId}`, null);
        }
    }

}
