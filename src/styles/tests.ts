import "test-dom";
import { ServiceProvider } from "../di/ServiceProvider";
import { AtomTheme } from "../Theme";
import { Assert, Category, Test, TestItem } from "../unit/base-test";

@Category("Styles")
export class TestCase extends TestItem {

    @Test()
    public async atomTheme(): Promise<any> {

        const theme = ServiceProvider.global.get(AtomTheme);

        await this.delay(200);

        Assert.isTrue(theme.styleElement ? true : false);

        // tslint:disable-next-line:no-console
        // console.log(theme.styleElement.textContent);
    }

}
