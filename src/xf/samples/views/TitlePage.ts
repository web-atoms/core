import { App } from "../../../App";
import { AtomBridge } from "../../../core/AtomBridge";
import { AtomXFControl } from "../../controls/AtomXFControl";

export default class TitlePage extends AtomXFControl {

    constructor(app: App, e?: any) {
        super(app, AtomBridge.instance.create("Xamarin.Forms.Grid"));
    }

    protected create(): void {

        this.loadXaml(`<Grid
        xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
        xmlns="http://xamarin.com/schemas/2014/forms"
        Padding="5">
        <Label
            Text="Title"
            />
    </Grid>`);

    }

}
