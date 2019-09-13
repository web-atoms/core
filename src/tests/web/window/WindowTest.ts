import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";
import { MockNavigationService } from "../../../services/MockNavigationService";
import { NavigationService } from "../../../services/NavigationService";
import AtomWebTest from "../AtomWebTest";

export class TestCase extends AtomWebTest {

    @Test
    public async noWindowRegistered(): Promise<any> {
        const nav = this.navigationService;

        try {
            await nav.openPage("WinA");
            Assert.throw("Should not reach here");
        } catch (e) {
            Assert.isTrue(/no window registered for/i.test(e));
        }
    }

    @Test
    public async removeExpectedWindow(): Promise<any> {
        const nav = this.navigationService;

        const d = nav.expectWindow("WinA", (v) => null);

        d.dispose();

        await this.noWindowRegistered();
    }

    @Test
    public async confirmTest(): Promise<any> {
        const nav = this.navigationService;

        nav.expectConfirm("C1", (mv) => true);

        Assert.isTrue( await nav.confirm("C1") );

        nav.expectConfirm("C2", (vm) => false);

        Assert.isFalse( await nav.confirm("C2"));
    }

    @Test
    public async openWindowError(): Promise<any> {
        const nav = this.navigationService;

        nav.expectWindow("WinA", (vm) => {
            throw new Error("Error");
        });

        try {
            await nav.openPage("WinA");
            Assert.throw("Should not reach here");
        } catch (e) {
            Assert.isTrue(e.message === "Error");
        }
    }

    @Test
    public async expectFailure(): Promise<any> {
        const nav = this.navigationService;

        nav.expectAlert("Hello");

        try {
            nav.assert();
            Assert.throw("Should not reach here");
        } catch (e) {
            Assert.isTrue(/expected windows did not open/i.test(e));
        }

        await nav.alert("Hello");
    }

    @Test
    public async expectWindow(): Promise<any> {
        // task: pending

        const nav = this.navigationService;

        nav.expectWindow("WinA", (vm) => {
            return "result";
        });

        const result = await nav.openPage("WinA");

        Assert.equals("result", result);

        nav.assert();

    }

}
