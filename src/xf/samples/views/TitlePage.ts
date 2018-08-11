import { AtomXFControl } from "../../controls/AtomXFControl";

export default class TitlePage extends AtomXFControl {

    protected create(): void {

        this.element = this.createControl("Xamarin.Forms.Grid");

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
