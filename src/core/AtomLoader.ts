import { App } from "../App";
import { AtomUri } from "./AtomUri";
import { IClassOf } from "./types";

declare class UMD {
    public static resolveViewClassAsync<T>(path: string): Promise<IClassOf<T>>;
}

export class AtomLoader {

    public static async load<T>(url: AtomUri, app: App): Promise<T> {
        const type = await UMD.resolveViewClassAsync<T>(url.path);
        const obj = app.resolve(type, true);
        return obj;
    }

}
