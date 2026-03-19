import { IClassOf } from "../core/types.js";

export interface IServiceProvider {

    resolve<T>(c: string | IClassOf<T>, create?: boolean ): T;

}
