import Assert from "@web-atoms/unit-test/dist/Assert.js";
import Category from "@web-atoms/unit-test/dist/Category.js";
import Test from "@web-atoms/unit-test/dist/Test.js";
import { Atom } from "../../Atom.js";
import { CancelToken } from "../../core/types.js";
import DISingleton from "../../di/DISingleton.js";
import { Inject } from "../../di/Inject.js";
import Action from "../../view-model/Action.js";
import { AtomViewModel, Validate } from "../../view-model/AtomViewModel.js";

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
