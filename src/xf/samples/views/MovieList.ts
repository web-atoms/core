import { App } from "../../../App";
import { AtomBridge } from "../../../core/AtomBridge";
import { AtomXFControl } from "../../controls/AtomXFControl";
import MovieListViewModel from "./MovieListViewModel";
import TitlePage from "./TitlePage";

export default class MovieList extends AtomXFControl {

    constructor(app: App, e?: any) {
        super(app, e || AtomBridge.instance.create("Xamarin.Forms.ContentPage"));
    }

    protected create(): void {
        this.setImport(this.element, "TitlePage", () => new TitlePage(this.app));

        this.loadXaml(`<ContentPage
        xmlns:atom="clr-namespace:WebAtoms;assembly=WebAtoms"
        xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
        xmlns="http://xamarin.com/schemas/2014/forms">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition/>
        </Grid.RowDefinitions>
        <atom:JSObjectCreator
            Type="TitlePage"/>
        <ListView
            Grid.Row="1"
            x:Name="listView"></ListView>
    </Grid>
</ContentPage>`);

        this.viewModel = this.resolve(MovieListViewModel);

        const label1 = this.find("listView");

        this.bind(label1, "ItemsSource", [["viewModel", "list"]]);

        this.setTemplate(label1, "ItemTemplate", () => new MovieListItemTemplate(this.app) );
    }
}

class MovieListItemTemplate extends AtomXFControl {

    constructor(app: App, e?: any) {
        super(app, AtomBridge.instance.create("Xamarin.Forms.Grid"));
    }

    protected create(): void {
        this.loadXaml(`<Grid
        xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
        xmlns="http://xamarin.com/schemas/2014/forms">
            <Label x:Name="label1"/>
        </Grid>`);

        const label = this.find("label1");
        this.bind(label, "Text", [["data", "label"]]);

    }
}
