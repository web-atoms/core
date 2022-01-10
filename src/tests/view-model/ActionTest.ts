import Assert from "@web-atoms/unit-test/dist/Assert";
import Category from "@web-atoms/unit-test/dist/Category";
import Test from "@web-atoms/unit-test/dist/Test";
import { Atom } from "../../Atom";
import { CancelToken } from "../../core/types";
import DISingleton from "../../di/DISingleton";
import { Inject, InjectedTypes } from "../../di/Inject";
import Action from "../../view-model/Action";
import { AtomViewModel, Validate } from "../../view-model/AtomViewModel";
import AtomWebTest from "../../unit/AtomWebTest";

interface IUser {
    name?: string;
    email?: string;
}

@DISingleton()
class RemoteService {
    public async signUp(user: IUser): Promise<any> {
        await Atom.delay(100);
        if (!/\@/i.test(user.email)) {
            throw new Error("Invalid email address");
        }
        return `Success ${user.name}`;
    }
}

class ActionViewModel extends AtomViewModel {

    public model: IUser = {
        name: "",
        email: ""
    };

    public result: string;

    @Validate
    public get errorName(): string {
        return this.model.name ? "" : "Name is required";
    }

    @Inject
    private remoteService: RemoteService;

    @Action({ confirm: "Are you sure you want to cancel"})
    public async cancel(): Promise<void> {
        await Atom.delay(10);
        this.model.name = "";
        this.model.email = "";
    }

    @Action({
        success: "Operation completed successfully",
        validate: true,
        successMode: "alert"
    })
    public async signUp(): Promise<void> {
        this.result = await this.remoteService.signUp(this.model);
    }

}

@Category("View Model Action")
export default class ActionTest extends AtomWebTest {

    @Test
    public async validate(): Promise<void> {
        const vm = await this.createViewModel(ActionViewModel);
        this.navigationService.expectAlert("Please enter correct information");

        await vm.signUp();
    }

    @Test
    public async exception(): Promise<void> {
        const vm = await this.createViewModel(ActionViewModel);
        vm.model.name = "a";
        vm.model.email = "a";
        this.navigationService.expectAlert("Error: Invalid email address");

        await vm.signUp();
    }

    @Test
    public async success(): Promise<void> {
        const vm = await this.createViewModel(ActionViewModel);
        vm.model.name = "a";
        vm.model.email = "a@a";
        this.navigationService.expectAlert("Operation completed successfully");
        await vm.signUp();
        Assert.equals("Success a", vm.result);
    }

    @Test
    public async confirm(): Promise<void> {
        const vm = await this.createViewModel(ActionViewModel);
        vm.model.name = "a";
        vm.model.email = "a@a";
        this.navigationService.expectConfirm("Are you sure you want to cancel", () => true);
        await vm.cancel();
        Assert.equals("", vm.model.name);
    }
}
