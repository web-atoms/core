import { AtomControl } from "../controls/AtomControl";
import { Service } from "../di";
import { AtomViewModel } from "../view-model/AtomViewModel";

@Service()
export class WindowService {

    public confirm(message: string, title: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public alert(message: string, title?: string): Promise<any> {
        throw new Error("Not implemented");
    }

    public openPopup<T>(c: {new(): AtomControl}, vm: AtomViewModel): Promise<T> {
        throw new Error("Not implemented");
    }
}
