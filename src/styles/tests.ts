import "test-dom";
import { App } from "../App";
import { AtomTheme } from "../styles/Theme";
import { Assert, Category, Test, TestItem } from "../unit/base-test";

@Category("Styles")
export class TestCase extends TestItem {

    @Test()
    public async atomTheme(): Promise<any> {

        const app = new App();

        const theme = app.get(AtomTheme);

        await this.delay(200);

        Assert.isTrue(theme.styleElement ? true : false);

        // tslint:disable-next-line:no-console
        // console.log(theme.styleElement.textContent);
    }

}
