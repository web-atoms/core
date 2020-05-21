import Assert from "@web-atoms/unit-test/dist/Assert";
import Category from "@web-atoms/unit-test/dist/Category";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";
import { App } from "../../../App";
import { MockApp } from "../../../MockApp";
import AtomWebTest from "../../../unit/AtomWebTest";
import { AtomTheme } from "../../../web/styles/AtomTheme";

@Category("Styles")
export class TestCase extends AtomWebTest {

    @Test
    public async atomTheme(): Promise<any> {

        const app = new MockApp();

        const theme = app.get(AtomTheme);

        await this.delay(200);

        Assert.isTrue(theme.styleElement ? true : false);

        // const a = theme.window.frameHost;
        // Assert.isTrue(a.className ? true : false);

        // tslint:disable-next-line:no-console
        // console.log(theme.styleElement.textContent);
    }

}
