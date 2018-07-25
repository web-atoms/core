import { Atom } from "../../../Atom";
import { AtomViewModel } from "../../../view-model/AtomViewModel";

export default class MovieListViewModel extends AtomViewModel {

    public label: string;

    public async init(): Promise<any> {
        while (true) {
            await Atom.delay(1000);
            this.label = (new Date()).toString();
        }
    }

}
