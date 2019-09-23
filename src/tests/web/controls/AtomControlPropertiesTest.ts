import Assert from "@web-atoms/unit-test/dist/Assert";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";
import Markdown from "../../../core/Markdown";
import { AtomControl } from "../../../web/controls/AtomControl";
import AtomWebTest from "../AtomWebTest";

class TestViewModel {

    public name: any = "";
}

class InputControl extends AtomControl {

    public create(): void {
        const input = document.createElement("input");
        this.viewModel = this.resolve(TestViewModel);
        this.append(input);

        this.runAfterInit(() => {
            this.setLocalValue(input, "autofocus", true);
        });
    }

}

class FormattedControl extends AtomControl {

    public create(): void {
        this.viewModel = this.resolve(TestViewModel);
        this.bind(this.element, "formattedText", [["viewModel", "name"]]);
    }
}

class ImageSrcControl extends AtomControl {

    public create(): void {
        this.viewModel = this.resolve(TestViewModel);
        this.bind(this.element, "src", [["viewModel", "name"]]);
    }
}

class SetClassControl extends AtomControl {

    public create(): void {
        this.viewModel = this.resolve(TestViewModel);
        this.bind(this.element, "class", [["viewModel", "name"]]);
    }
}

export default class AtomControlPropertiesTest extends AtomWebTest {

    @Test
    public async autoFocus(): Promise<void> {
        const root = document.createElement("div");
        const control = new InputControl(this.app, root);

        await this.app.waitForPendingCalls();

        const input = control.element.firstElementChild as HTMLInputElement;
        Assert.equals(input, document.activeElement);

    }

    @Test
    public async formattedText(): Promise<void> {
        const control = new FormattedControl(this.app);

        await this.app.waitForPendingCalls();

        control.viewModel.name = Markdown.from("Akash **Kava**");

        Assert.equals("Akash <strong>Kava</strong>", control.element.innerHTML);

    }

    @Test
    public async src(): Promise<void> {
        const control = new ImageSrcControl(this.app, document.createElement("img"));

        await this.app.waitForPendingCalls();

        control.viewModel.name = "/a.jpg";

        const img = control.element as HTMLImageElement;

        Assert.equals("/a.jpg", img.src);

        control.viewModel.name = "http://a/a.jpg";

        Assert.equals("//a/a.jpg", img.src);
    }

    @Test
    public async setClass(): Promise<void> {

        const control = new SetClassControl(this.app);
        await this.app.waitForPendingCalls();

        const vm = control.viewModel as TestViewModel;

        vm.name = { a: 1, b: 1, c: 0 };

        Assert.equals("a b", control.element.className);

    }
}
