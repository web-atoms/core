import { App } from "../App";
import { AtomUri } from "./AtomUri";
import { _UMD, IClassOf } from "./types";

export class AtomLoader {

    public static async load<T>(url: AtomUri, app: App): Promise<T> {
        const type = await _UMD.resolveViewClassAsync<T>(url.path);
        const obj = app.resolve(type, true);
        return obj;
    }

}
