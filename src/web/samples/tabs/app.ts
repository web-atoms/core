import { NavigationService } from "../../../services/NavigationService";
import { AtomTabbedPage } from "../../controls/AtomTabbedPage";
import WebApp from "../../WebApp";

export class TabApp extends WebApp {
    public main(): void {
        const page = new AtomTabbedPage(this);
        this.root = page;

        setTimeout(async () => {
            const nav = this.resolve(NavigationService) as NavigationService;
            await nav.openPage("web-atoms-core/bin/web/samples/tabs/views/Page1", {
                message: "Page 1"
            });
            await nav.openPage("web-atoms-core/bin/web/samples/tabs/views/Page1", {
                message: "Page 2"
            });
        }, 1000);
    }
}
