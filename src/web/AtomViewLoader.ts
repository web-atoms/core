import { AtomLoader } from "../core/AtomLoader";
import { AtomUri } from "../core/AtomUri";
import { JsonService } from "../services/JsonService";
import { AtomControl } from "./controls/AtomControl";

export class AtomViewLoader {

    public static async loadView<T extends AtomControl>(
        url: AtomUri,
        jsonService: JsonService,
        ...p: any[]): Promise<T> {
        const view = await AtomLoader.load<T>(url, p);

        const vm = view.viewModel;
        if (vm) {
            for (const key in url.query) {
                if (url.query.hasOwnProperty(key)) {
                    const element = url.query[key];
                    if (typeof element === "object") {
                        vm[key] = jsonService.parse(jsonService.stringify(element));
                    } else {
                        vm[key] = element;
                    }
                }
            }
        }

        return view;
    }
}
