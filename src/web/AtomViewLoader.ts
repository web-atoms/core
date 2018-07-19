import { App } from "../App";
import { AtomLoader } from "../core/AtomLoader";
import { AtomUri } from "../core/AtomUri";
import { JsonService } from "../services/JsonService";
import { AtomControl } from "./controls/AtomControl";

export class AtomViewLoader {

    public static async loadView<T extends AtomControl>(
        url: AtomUri,
        app: App): Promise<T> {
        const view = await AtomLoader.load<T>(url, app);

        const vm = view.viewModel;
        if (vm) {
            const jsonService = app.get(JsonService);
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
