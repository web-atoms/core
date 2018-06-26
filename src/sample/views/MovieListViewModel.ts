import { App } from "../../App";
import { AtomBinder } from "../../core/AtomBinder";
import { bindableProperty } from "../../core/bindable-properties";
import { Inject } from "../../di/Inject";
import { WindowService } from "../../services/WindowService";
import { AtomViewModel, validate } from "../../view-model/AtomViewModel";

export interface IMovie {
    label: string;
    value?: string;
    category: string;
}

export class MovieListViewModel extends AtomViewModel {

    @bindableProperty
    public movies: IMovie[] = [
        { label: "First", category: "None" },
        { label: "True Lies", category: "Action" },
        { label: "Jurassic Park", category: "Adventure" },
        { label: "Big", category: "Kids" },
        { label: "Inception", category: "Suspense" },
        { label: "Last", category: "None" },
    ];

    @bindableProperty
    public selectedMovie: IMovie;

    constructor(
        @Inject app: App,
        @Inject private windowService: WindowService) {
        super(app);
    }

    @validate
    public get errorSelectedMovie(): string {
        return this.selectedMovie ? "" : "Please select any movie";
    }

    public onItemClick(data: IMovie): void {
        this.selectedMovie = data;
    }

    public async onDelete(data: IMovie): Promise<any> {
        if (! (await this.windowService.confirm("Are you sure you want to delete?", "Confirm"))) {
            return;
        }
        AtomBinder.removeItem(this.movies, data);
        await this.windowService.alert("Movie deleted successfully.");
    }

}
