import { App } from "../App";
import { bindableProperty } from "../core/BindableProperty";
import { Assert, Category, Test, TestItem } from "../unit/base-test";
import { AtomViewModel, watch } from "./AtomViewModel";

interface ICustomer {
    firstName: string;
    lastName: string;
}

class TestViewModel extends AtomViewModel {

    public errorText: string;

    @bindableProperty
    public customer: ICustomer;

    @watch
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

    @watch
    public setError(): void {
        this.errorText = this.error;
    }
}

@Category("ViewModel")
export class ViewModelTestCase extends TestItem {

    @Test()
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
