import { App } from "../../../../App";
import { Inject } from "../../../../di/Inject";
import { NavigationService } from "../../../../services/NavigationService";
import { AtomViewModel } from "../../../../view-model/AtomViewModel";
import { AtomTabbedPage } from "../../../controls/AtomTabbedPage";

export default class TabHost extends AtomTabbedPage {

    protected create(): void {
        this.tabChannelName = "app";
        this.viewModel = this.resolve(TabHostViewModel);
    }
}

class TabHostViewModel extends AtomViewModel {

    constructor(
        @Inject app: App,
        @Inject private nav: NavigationService) {
        super(app);
    }

    public async init(): Promise<any> {
        await this.nav.openPage("tab://app/web-atoms-core/bin/web/samples/tabs/views/Page1", {
            message: "Page 1"
        });
        await this.nav.openPage("tab://app/web-atoms-core/bin/web/samples/tabs/views/Page1", {
            message: "Page 2"
        });

    }
}
