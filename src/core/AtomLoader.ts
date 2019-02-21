import { App } from "../App";
import { JsonService } from "../services/JsonService";
import ReferenceService from "../services/ReferenceService";
import { AtomUri } from "./AtomUri";
import { DI, IClassOf } from "./types";

export class AtomLoader {

    public static async load<T>(url: AtomUri, app: App): Promise<T> {
        if (url.host === "reference") {
            const r = app.get(ReferenceService).get(url.path);
            if (!r) {
                // tslint:disable-next-line: no-console
                console.warn(`reference not found for ${url.toString()}`);
                throw new Error("reference not found");
            }
            return r.consume();
        }
        if (url.host === "class") {
            const r = app.get(ReferenceService).get(url.path);
            if (!r) {
                // tslint:disable-next-line: no-console
                console.warn(`reference not found for ${url.toString()}`);
                throw new Error("reference not found");
            }
            return app.resolve(r.consume(), true);
        }
        const type = await DI.resolveViewClassAsync<T>(url.path);
        if (!type) {
            // tslint:disable-next-line: no-console
            console.warn(`type not found for ${url.path}`);
        }
        const obj = app.resolve(type, true);
        if (!obj) {
            // tslint:disable-next-line: no-console
            console.warn(`failed to resolve object for ${url.path}`);
        }
        return obj;
    }

    public static async loadView<T extends { viewModel: any, element: any }>(
        url: AtomUri,
        app: App): Promise<T> {

        const busyIndicator = app.createBusyIndicator();

        try {
            const view = await AtomLoader.load<T>(url, app);
            if (!view) {
                // tslint:disable-next-line: no-console
                console.warn(`failed to load view for ${url}`);
            }
            const vm = view.viewModel;
            if (vm) {
                const jsonService = app.get(JsonService);
                for (const key in url.query) {
                    if (url.query.hasOwnProperty(key)) {
                        const element = url.query[key];
                        if (typeof element === "object") {
                            vm[key] = jsonService.parse(jsonService.stringify(element));
                            continue;
                        }
                        if (/^json\:/.test(key)) {
                            const k = key.split(":")[1];
                            vm[k] = jsonService.parse(element.toString());
                            continue;
                        }
                        if (/^ref\:/.test(key)) {
                            const rs = app.get(ReferenceService);
                            const v = rs.get(element as string);
                            vm[key.split(":", 2)[1]] = v.consume();
                            continue;
                        }
                        vm[key] = element;
                    }
                }
            }

            return view;
        } catch (e) {
// tslint:disable-next-line: no-console
            console.error(e);
            throw e;
        } finally {
            busyIndicator.dispose();
        }
    }

}
