import Assert from "@web-atoms/unit-test/dist/Assert";
import Category from "@web-atoms/unit-test/dist/Category";
import Test from "@web-atoms/unit-test/dist/Test";
import { AtomViewModel } from "../../../view-model/AtomViewModel";
import { AtomControl } from "../../../web/controls/AtomControl";
import { AtomStyle } from "../../../web/styles/AtomStyle";
import { IStyleDeclaration } from "../../../web/styles/IStyleDeclaration";
import AtomWebTest from "../../../unit/AtomWebTest";

class TestControl extends AtomControl {

    public create(): void {
        this.defaultControlStyle = TestStyle;

        this.runAfterInit(() => {
            this.element.className = this.controlStyle.root.className;
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
        this.bind(this.element, "class", [["this", "controlStyle", "root", "className"]], false, null, this);
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
        Assert.equals( tc.controlStyle.root.className, tc.element.className);
    }

    @Test
    public async inheritedStyle(): Promise<void> {
        const tc = new InheritedTestControl(this.app);

        await this.app.waitForPendingCalls();

        Assert.isTrue(tc.controlStyle instanceof TestStyle);
        Assert.equals( tc.controlStyle.root.className, tc.element.className);
    }

    @Test
    public async styleChange(): Promise<void> {
        const tc = new InheritedTestControl(this.app);

        await this.app.waitForPendingCalls();

        tc.controlStyle = InheritedStyle as any;

        Assert.isTrue(tc.controlStyle instanceof InheritedStyle);
        Assert.equals( tc.controlStyle.root.className, tc.element.className);
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
