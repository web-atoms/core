import { MovieList } from "./views/MovieList";
import { MovieListViewModel } from "./views/MovieListViewModel";

export class App {

    public main(): void {
        document.addEventListener("readystatechange", () => {
            const ml = new MovieList();
            ml.viewModel = new MovieListViewModel();
            document.body.appendChild(ml.element);
            ml.init();
        });
    }

}

const app = new App();
app.main();

// tslint:disable-next-line:no-console
console.log("Application loaded");
