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
        <Grid.RowDefinitions>
            <RowDefinition/>
            <RowDefinition/>
            <RowDefinition/>
        </Grid.RowDefinitions>

        <Grid.ColumnDefinitions>
            <ColumnDefinition/>
            <ColumnDefinition/>
            <ColumnDefinition/>
        </Grid.ColumnDefinitions>
        <Label
            Text="Sample"
            />
        <Label
            x:Name="label1"
            Grid.Row="1"
            Grid.Column="1"
        />
    </Grid>
</ContentPage>
        `);

        this.viewModel = this.resolve(MovieListViewModel);

        const label1 = this.find("label1");

        this.bind(label1, "Text", [["viewModel", "label"]]);
    }
}
