import { AtomUri } from "./AtomUri";
import { IClassOf } from "./types";

declare class UMD {
    public static resolveViewClassAsync<T>(path: string): Promise<IClassOf<T>>;
}

export class AtomLoader {

    public static async load<T>(url: AtomUri, ... p: any[]): Promise<T> {
        const type = await UMD.resolveViewClassAsync<T>(url.path);
        p.unshift(null);
        const obj = new (type.bind.apply(type, p))();
        return obj;
    }

}
