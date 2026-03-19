import { App } from "../../../../App.js";
import { Inject } from "../../../../di/Inject.js";
import { NavigationService } from "../../../../services/NavigationService.js";
import { AtomViewModel } from "../../../../view-model/AtomViewModel.js";
import { AtomTabbedPage } from "../../../controls/AtomTabbedPage.js";

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
        await this.nav.openPage("tab://app/web-atoms-core/dist/web/samples/tabs/views/Page1", {
            message: "Page 1",
            title: "Page 1"
        });
        await this.nav.openPage("tab://app/web-atoms-core/dist/web/samples/tabs/views/Page1", {
            message: "Page 2",
            title: "Page 2"
        });

    }
}
