import { AtomBridge } from "../../../core/AtomBridge";
import { AtomXFControl } from "../../controls/AtomXFControl";
import MovieListViewModel from "./MovieListViewModel";

export default class MovieList extends AtomXFControl {

    protected create(): void {
        this.element = this.createControl("Xamarin.Forms.ContentPage");

        this.loadXaml(`<ContentPage
        xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
        xmlns="http://xamarin.com/schemas/2014/forms">
    <Grid>
        <ListView x:Name="listView"></ListView>
    </Grid>
</ContentPage>
        `);

        this.viewModel = this.resolve(MovieListViewModel);

        const label1 = this.find("listView");

        this.bind(label1, "ItemsSource", [["viewModel", "list"]]);
        this.setPrimitiveValue(label1, "ItemTemplate", MovieListItemTemplate );
    }
}

class MovieListItemTemplate extends AtomXFControl {

    protected create(): void {
        this.element = this.createControl("Xamarin.Forms.Grid");

        this.loadXaml(`<Grid
        xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
        xmlns="http://xamarin.com/schemas/2014/forms">
            <Label x:Name="label1"/>
        </Grid>`);

        const label = this.find("label1");
        this.bind(label, "Text", [["data", "label"]]);

    }
}
