import "test-dom";
import { AtomDispatcher } from "../../core/AtomDispatcher";
import { MockNavigationService } from "../../services/MockNavigationService";
import { NavigationService } from "../../services/NavigationService";
import { AtomTest } from "../../unit/AtomTest";
import { AtomGridView } from "../../web/controls/AtomGridView";
import { AtomStyleSheet } from "../../web/styles/AtomStyleSheet";
import { AtomTheme } from "../../web/styles/AtomTheme";

export default class  AtomWebTest extends AtomTest {

    public get navigationService(): MockNavigationService {
        return this.app.get(NavigationService as any);
    }

    constructor() {
        super();
        this.app.put(AtomTheme, this.app.resolve(AtomTheme));
        this.app.put(AtomStyleSheet, this.app.resolve(AtomTheme));

    }

    public async dispose(): Promise<any> {
        if (this.navigationService.assert) {
            this.navigationService.assert();
        }
        await this.app.waitForPendingCalls();
    }

}
