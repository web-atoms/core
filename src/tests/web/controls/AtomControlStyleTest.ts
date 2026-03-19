import Assert from "@web-atoms/unit-test/dist/Assert.js";
import Category from "@web-atoms/unit-test/dist/Category.js";
import Test from "@web-atoms/unit-test/dist/Test.js";
import AtomWebTest from "../../../unit/AtomWebTest.js";
import { AtomViewModel } from "../../../view-model/AtomViewModel.js";
import { AtomControl } from "../../../web/controls/AtomControl.js";
import { AtomStyle } from "../../../web/styles/AtomStyle.js";
import { IStyleDeclaration } from "../../../web/styles/IStyleDeclaration.js";

class TestControl extends AtomControl {

    public create(): void {
        this.defaultControlStyle = TestStyle;

        this.runAfterInit(() => {
            this.element.className = this.controlStyle.name;
        });
    }

}

class TestStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            padding: "5px"
        };
    }

}

class InheritedStyle extends TestStyle {

    public get root(): IStyleDeclaration {
        return {
            padding: "5px"
        };
    }

}

class InheritedTestControl extends TestControl {
    public create(): void {
        this.defaultControlStyle = TestStyle;
        this.bind(this.element, "class", [["this", "controlStyle", "name"]], false, null, this);
    }
}

class TestViewModel extends AtomViewModel {

    public model: any;

}

class StyleElementClass extends AtomControl {

    public create(): void {
        this.viewModel = this.resolve(TestViewModel);
        this.bind(this.element, "styleClass", [["viewModel", "model"]]);
    }
}

@Category("AtomControl Style")
export default class AtomControlStyleTest extends AtomWebTest {

    @Test
    public async defaultStyle(): Promise<void> {
        const tc = new TestControl(this.app);

        await this.app.waitForPendingCalls();

        Assert.isTrue(tc.controlStyle instanceof TestStyle);
        Assert.equals( tc.controlStyle.name, tc.element.className);
    }

    @Test
    public async inheritedStyle(): Promise<void> {
        const tc = new InheritedTestControl(this.app);

        await this.app.waitForPendingCalls();

        Assert.isTrue(tc.controlStyle instanceof TestStyle);
        Assert.equals( tc.controlStyle.name, tc.element.className);
    }

    @Test
    public async styleChange(): Promise<void> {
        const tc = new InheritedTestControl(this.app);

        await this.app.waitForPendingCalls();

        tc.controlStyle = InheritedStyle as any;

        Assert.isTrue(tc.controlStyle instanceof InheritedStyle);
        Assert.equals( tc.controlStyle.name, tc.element.className);
    }

    @Test
    public async styleClass(): Promise<void> {
        const tc = new StyleElementClass(this.app);

        await this.app.waitForPendingCalls();

        const vm = tc.viewModel as TestViewModel;
        vm.model = { a: 1, b: 2 };

        Assert.equals(tc.element.className, "a b");

        vm.model = { a: 0, b: 1 };
        Assert.equals(tc.element.className, "b");
    }
}
