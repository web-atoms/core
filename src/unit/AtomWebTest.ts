import { AtomDispatcher } from "../core/AtomDispatcher.js";
import { MockApp } from "../MockApp.js";
import { MockNavigationService } from "../services/MockNavigationService.js";
import { NavigationService } from "../services/NavigationService.js";
import { AtomTest } from "./AtomTest.js";
import { AtomGridView } from "../web/controls/AtomGridView.js";
import { AtomStyleSheet } from "../web/styles/AtomStyleSheet.js";
import { AtomTheme } from "../web/styles/AtomTheme.js";

export class MockWebApp extends MockApp {

}

export default class  AtomWebTest extends AtomTest {

    public get navigationService(): MockNavigationService {
        return this.app.get(NavigationService as any);
    }

    constructor() {
        super(new MockWebApp());
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
