import Assert from "@web-atoms/unit-test/dist/Assert.js";
import Test from "@web-atoms/unit-test/dist/Test.js";
import { AtomUri } from "../../core/AtomUri.js";
import { AtomViewModel, BindableBroadcast,
    BindableReceive, Receive, Validate, waitForReady, Watch } from "../../view-model/AtomViewModel.js";
import BindableUrlParameter from "../../view-model/BindableUrlParameter.js";

declare var global: any;

class TestViewModel extends AtomViewModel {

    public model: any = {};

    public async init(): Promise<any> {
        // nothing...
    }

    @Watch
    public watchModel(): void {
        this.model.fullName = [this.model.firstName, this.model.lastName]
            .filter((s) => s)
            .join(" ");
    }

    @Validate
    public get errorFirstName(): string {
        return this.model.firstName ? "" : "Firstname cannot be empty";
    }

    @Validate
    public get errorLastName(): string {
        return this.model.lastName ? "" : "Lastname cannot be empty";
    }

    public async save(): Promise<any> {
        if (!this.isValid) {
            return;
        }
    }
}

class BroadcastViewModel extends AtomViewModel {

    @BindableBroadcast("channel1")
    public channel1: string;

}

class ReceiveViewModel extends AtomViewModel {

    @BindableReceive("channel1")
    public channel1: string;

    public channel2: any;

    @Receive("channel2")
    public receiveSome(sender: any, message: any): void {
        this.channel2 = message;
    }

}

class BindableUrlViewModel extends AtomViewModel {

    @BindableUrlParameter("app-url")
    public url: string = "start";

}
