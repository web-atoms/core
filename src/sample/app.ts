import { App } from "../App";
import { ServiceProvider } from "../di/ServiceProvider";
import { MovieList } from "./views/MovieList";
import { MovieListViewModel } from "./views/MovieListViewModel";

export class SampleApp extends App {

    public main(): void {
        const ml = new MovieList();
        ml.viewModel = ServiceProvider.global.get(MovieListViewModel);
        document.body.appendChild(ml.element);
        ml.init();
    }

}

const app = new SampleApp();
