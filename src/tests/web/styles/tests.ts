import "test-dom";
import { App } from "../../../App";
import { Assert } from "../../../unit/Assert";
import { Category } from "../../../unit/Category";
import { Test } from "../../../unit/Test";
import { TestItem } from "../../../unit/TestItem";
import { AtomTheme } from "../../../web/styles/AtomTheme";

@Category("Styles")
export class TestCase extends TestItem {

    @Test
    public async atomTheme(): Promise<any> {

        const app = new App();

        const theme = app.get(AtomTheme);

        await this.delay(200);

        Assert.isTrue(theme.styleElement ? true : false);

        const a = theme.window.frameHost;
        // tslint:disable-next-line:no-debugger
        debugger;
        Assert.isTrue(a.className ? true : false);

        // tslint:disable-next-line:no-console
        // console.log(theme.styleElement.textContent);
    }

}
