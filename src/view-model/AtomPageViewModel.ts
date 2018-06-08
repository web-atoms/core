import { AtomDevice } from "../core/AtomDevice";
import { Inject } from "../di/Inject";
import { WindowService } from "../services/WindowService";
import { AtomViewModel } from "./AtomViewModel";

export class AtomPageViewModel extends AtomViewModel {

    public pageId: string;

    public closeWarning: string;

    constructor(
        @Inject protected windowService: WindowService,
        @Inject private device1: AtomDevice
    ) {
        super(device1);
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
