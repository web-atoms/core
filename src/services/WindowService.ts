import { AtomControl } from "../controls/AtomControl";
import { AtomWindow } from "../controls/AtomWindow";
import { IClassOf } from "../core/types";
import { RegisterSingleton } from "../di/RegisterSingleton";
import { AtomViewModel } from "../view-model/AtomViewModel";

@RegisterSingleton
export class WindowService {

    public confirm(message: string, title: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public alert(message: string, title?: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public openPopup<T>(c: IClassOf<AtomControl>, vm: AtomViewModel): Promise<T> {
        throw new Error("Method not implemented.");
    }

    public openWindow<T>(c: IClassOf<AtomWindow>, vm: AtomViewModel): Promise<T> {
        throw new Error("Method not implemented.");
    }
}
