import { Assert } from "../../unit/Assert";
import { AtomTest } from "../../unit/AtomTest";
import { Test } from "../../unit/Test";
import { AtomViewModel, Validate } from "../../view-model/AtomViewModel";

export default class ParentViewModelTest extends AtomTest {

    @Test
    public async validation(): Promise<void> {

        const parent = new DataViewModel(this.app);

        const child = new DataViewModel(this.app);
        child.parent = parent;

        await this.app.waitForPendingCalls();

        Assert.isEmpty(parent.errorName);

        Assert.isEmpty(child.errorName);

        parent.model.name = "a";

        Assert.isFalse(parent.isValid);

        Assert.equals("Name cannot be empty", child.errorName);

    }

    @Test
    public async validationWithDisposableChild(): Promise<void> {

        const parent = new DataViewModel(this.app);

        const child = new DataViewModel(this.app);
        child.parent = parent;

        await this.app.waitForPendingCalls();

        Assert.isEmpty(parent.errorName);

        Assert.isEmpty(child.errorName);

        parent.model.name = "a";

        Assert.isFalse(parent.isValid);

        Assert.equals("Name cannot be empty", child.errorName);

        child.dispose();

        Assert.isTrue(parent.isValid);

    }

    @Test
    public async validationWithDirtyChild(): Promise<void> {

        const parent = new DataViewModel(this.app);

        const child = new DataViewModel(this.app);
        child.parent = parent;

        await this.app.waitForPendingCalls();

        Assert.isEmpty(parent.errorName);

        Assert.isEmpty(child.errorName);

        parent.model.name = "a";

        Assert.isFalse(parent.isValid);

        Assert.equals("Name cannot be empty", child.errorName);

        child.parent = null;

        Assert.isTrue(parent.isValid);

    }

    @Test
    public async validationWithMultipleChild(): Promise<void> {
        const parent = new DataViewModel(this.app);

        const child = new DataViewModel(this.app);
        child.parent = parent;

        const child2 = new DataViewModel(this.app);
        child2.parent = parent;

        Assert.equals(parent, child2.parent);

        await this.app.waitForPendingCalls();

        Assert.isEmpty(parent.errorName);

        Assert.isEmpty(child.errorName);

        parent.model.name = "a";

        child2.model.name = "a";

        Assert.isFalse(parent.isValid);

        Assert.equals("Name cannot be empty", child.errorName);

        child.dispose();

        Assert.isTrue(parent.isValid);
    }
}

class DataViewModel extends AtomViewModel {

    public model: any = {};

    @Validate
    public get errorName(): string {
        return this.model.name ? "" : "Name cannot be empty";
    }

}
