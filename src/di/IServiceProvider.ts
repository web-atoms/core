import { IClassOf } from "../core/types";

export interface IServiceProvider {

    resolve<T>(c: IClassOf<T>, create?: boolean ): T;

}
