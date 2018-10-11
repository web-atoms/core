import { App } from "../../../App";
import { BindableProperty } from "../../../core/BindableProperty";
import { Assert } from "../../../unit/Assert";
import { Category } from "../../../unit/Category";
import { Test } from "../../../unit/Test";
import { TestItem } from "../../../unit/TestItem";
import { AtomViewModel, Watch } from "../../../view-model/AtomViewModel";

interface ICustomer {
    firstName: string;
    lastName: string;
}

class TestViewModel extends AtomViewModel {

    public errorText: string;

    @BindableProperty
    public customer: ICustomer;

    @Watch
    public get error(): string {
        if (this.customer) {
            if (!this.customer.firstName) {
                return "Firstname missing";
            }
            if (!this.customer.lastName) {
                return "Lastname missing";
            }
        }
        return "Data missing";
    }

    @Watch
    public setError(): void {
        this.errorText = this.error;
    }
}

@Category("ViewModel")
export class ViewModelTestCase extends TestItem {

    @Test
    public async watchTest(): Promise<any> {

        const app = new App();

        const tvm = new TestViewModel(app);
        await tvm.waitForReady();

        tvm.customer = { firstName: "", lastName: "Tss"};

        Assert.equals("Firstname missing", tvm.errorText);

        tvm.customer = null;

        Assert.equals("Data missing", tvm.errorText);
    }
}
