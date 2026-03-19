import WebApp from "../../../web/WebApp.js";
import { MovieList } from "./views/MovieList.js";
import { MovieListViewModel } from "./views/MovieListViewModel.js";

export class SampleApp extends WebApp {

    public main(): void {
        const ml = new MovieList(this);
        ml.viewModel = this.get(MovieListViewModel);
        document.body.appendChild(ml.element);
    }

}

const app = new SampleApp();
