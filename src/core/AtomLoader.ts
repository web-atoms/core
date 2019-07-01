import { App } from "../App";
import { JsonService } from "../services/JsonService";
import ReferenceService from "../services/ReferenceService";
import { AtomWindowViewModel } from "../view-model/AtomWindowViewModel";
import { AtomDisposableList } from "./AtomDisposableList";
import { AtomUri } from "./AtomUri";
import { DI, IClassOf, IDisposable } from "./types";

export class AtomLoader {

    public static id: number = 1;

    public static async load<T>(url: AtomUri, app: App): Promise<T> {
        if (url.host === "reference") {
            const r = app.get(ReferenceService).get(url.path);
            if (!r) {
                throw new Error("reference not found");
            }
            return r.consume();
        }
        if (url.host === "class") {
            const r = app.get(ReferenceService).get(url.path);
            if (!r) {
                throw new Error("reference not found");
            }
            return app.resolve(r.consume(), true);
        }
        const type = await DI.resolveViewClassAsync(url.path);
        if (!type) {
            throw new Error(`Type not found for ${url}`);
        }
        const obj = app.resolve(type, true);
        return obj;
    }

    public static async loadView<T extends { viewModel: any, element: any }>(
        url: AtomUri,
        app: App,
        vmFactory?: () => any): Promise<{
            view: T,
            disposables?: AtomDisposableList,
            returnPromise?: Promise<any>,
            id?: string}> {

        const busyIndicator = app.createBusyIndicator();

        try {
            const view = await AtomLoader.load<T>(url, app);
            let vm = view.viewModel;
            if (!vm) {
                if (!vmFactory) {
                    return { view };
                }
                vm = vmFactory();
                view.viewModel = vm;
            }
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

            // register hooks !! if it is a window !!
            if (vm instanceof AtomWindowViewModel) {

                const disposables = new AtomDisposableList();

                const id = (AtomLoader.id++).toString();
                (view as any).id = id;

                const returnPromise = new Promise((resolve, reject) => {
                    disposables.add( app.subscribe(`atom-window-close:${id}`, (r) => {
                        resolve(r);
                        disposables.dispose();
                    }));
                    disposables.add( app.subscribe(`atom-window-cancel:${id}`, () => {
                        reject("cancelled");
                        disposables.dispose();
                    }));
                });

                // it is responsibility of view holder to dispose the view
                // disposables.add((view as any));

                vm.windowName = id;

                (view as any).returnPromise = returnPromise;

                return { view, disposables, returnPromise, id };
            }

            return { view };
        } finally {
            busyIndicator.dispose();
        }
    }

}
