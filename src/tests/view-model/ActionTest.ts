import Category from "@web-atoms/unit-test/dist/Category";
import { Atom } from "../../Atom";
import { CancelToken } from "../../core/types";
import DISingleton from "../../di/DISingleton";
import { Inject, InjectedTypes } from "../../di/Inject";
import Action from "../../view-model/Action";
import { AtomViewModel, Validate } from "../../view-model/AtomViewModel";
import AtomWebTest from "../web/AtomWebTest";
import Test from "@web-atoms/unit-test/dist/Test";
import Assert from "@web-atoms/unit-test/dist/Assert";

interface IUser {
    name?: string;
    email?: string;
}

@DISingleton()
class RemoteService {
    public async signup(user: IUser): Promise<any> {
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

    @Action({ confirm: "Are you sure you want to cancel", success: null })
    public async cancel(): Promise<void> {
        await Atom.delay(10);
        this.model.name = "";
        this.model.email = "";
    }

    @Action({ validate: true })
    public async signup(): Promise<void> {
        this.result = await this.remoteService.signup(this.model);
    }

}

@Category("View Model Action")
export default class ActionTest extends AtomWebTest {

    @Test
    public async validate(): Promise<void> {
        const vm = await this.createViewModel(ActionViewModel);
        this.navigationService.expectAlert("Please enter correct information");

        await vm.signup();
    }

    @Test
    public async exception(): Promise<void> {
        const vm = await this.createViewModel(ActionViewModel);
        vm.model.name = "a";
        vm.model.email = "a";
        this.navigationService.expectAlert("Error: Invalid email address");

        await vm.signup();
    }

    @Test
    public async success(): Promise<void> {
        const vm = await this.createViewModel(ActionViewModel);
        vm.model.name = "a";
        vm.model.email = "a@a";
        this.navigationService.expectAlert("Operation completed successfully");
        await vm.signup();
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
