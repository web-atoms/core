import { bindableProperty } from "../../core/bindable-properties";
import { AtomViewModel } from "../../view-model/AtomViewModel";

export interface IMovie {
    label: string;
    value?: string;
    category: string;
}

export class MovieListViewModel extends AtomViewModel {

    @bindableProperty
    public movies: IMovie[] = [
        { label: "True Lies", category: "Action" },
        { label: "Jurassic Park", category: "Adventure" },
        { label: "Big", category: "Kids" },
        { label: "Inception", category: "Suspense" }
    ];

    @bindableProperty
    public selectedMovie: IMovie;

    public onItemClick(data: IMovie): void {
        this.selectedMovie = data;
    }

}
