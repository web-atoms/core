import { App } from "../../../App";
import { BindableProperty } from "../../../core/BindableProperty";
import Assert from "@web-atoms/unit-test/dist/Assert";
import Category from "@web-atoms/unit-test/dist/Category";
import Test from "@web-atoms/unit-test/dist/Test";
import TestItem from "@web-atoms/unit-test/dist/TestItem";
import { AtomViewModel, waitForReady, Watch } from "../../../view-model/AtomViewModel";

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
        await waitForReady(tvm);

        tvm.customer = { firstName: "", lastName: "Tss"};

        Assert.equals("Firstname missing", tvm.errorText);

        tvm.customer = null;

        Assert.equals("Data missing", tvm.errorText);
    }
}
