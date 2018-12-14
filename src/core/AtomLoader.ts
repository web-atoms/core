import { App } from "../App";
import { JsonService } from "../services/JsonService";
import { AtomUri } from "./AtomUri";
import { DI, IClassOf } from "./types";

export class AtomLoader {

    public static async load<T>(url: AtomUri, app: App): Promise<T> {
        const type = await DI.resolveViewClassAsync<T>(url.path);
        const obj = app.resolve(type, true);
        return obj;
    }

    public static async loadView<T extends { viewModel: any, element: any }>(
        url: AtomUri,
        app: App): Promise<T> {

        const busyIndicator = app.createBusyIndicator();

        try {
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
                            if (/^json\:/.test(key)) {
                                const k = key.split(":")[1];
                                vm[k] = JSON.parse(element as string);
                            } else {
                                vm[key] = element;
                            }
                        }
                    }
                }
            }

            return view;
        } finally {
            busyIndicator.dispose();
        }
    }

}
