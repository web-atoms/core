import { WebApp } from "../../web/WebApp";
import { MovieList } from "./views/MovieList";
import { MovieListViewModel } from "./views/MovieListViewModel";

export class SampleApp extends WebApp {

    public main(): void {
        const ml = new MovieList(this);
        ml.viewModel = this.get(MovieListViewModel);
        document.body.appendChild(ml.element);
    }

}

const app = new SampleApp();
