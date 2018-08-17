import { App } from "../App";
import { AtomUri } from "./AtomUri";
import { DI, IClassOf } from "./types";

export class AtomLoader {

    public static async load<T>(url: AtomUri, app: App): Promise<T> {
        const type = await DI.resolveViewClassAsync<T>(url.path);
        const obj = app.resolve(type, true);
        return obj;
    }

}
