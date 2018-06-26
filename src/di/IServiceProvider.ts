import { IClassOf } from "../core/types";

export interface IServiceProvider {

    resolve<T>(c: string | IClassOf<T>, create?: boolean ): T;

}
