import { Atom } from "../../../Atom";
import { AtomViewModel } from "../../../view-model/AtomViewModel";
import { IMovie } from "../../../web/samples/demo/views/MovieListViewModel";

export default class MovieListViewModel extends AtomViewModel {

    public label: string;

    public list: IMovie[] = [];

    public async init(): Promise<any> {
        this.list = [
            {
                label: "True Lies",
                value: "true-lies",
                category: "Action"
            },
            {
                label: "Die Hard",
                value: "die-hard",
                category: "Action"
            }
        ];
    }

}
