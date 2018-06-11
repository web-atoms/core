import { App } from "../App";
import { MovieList } from "./views/MovieList";
import { MovieListViewModel } from "./views/MovieListViewModel";

export class SampleApp extends App {

    public main(): void {
        const ml = new MovieList();
        ml.viewModel = new MovieListViewModel();
        document.body.appendChild(ml.element);
        ml.init();
    }

}

const app = new SampleApp();
