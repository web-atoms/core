import { IClassOf } from "../core/types";
import { Register } from "./Register";
import { Scope } from "./ServiceCollection";

export function RegisterScoped(id: IClassOf<any>): any {
    Register({scope: Scope.Scoped})(id);
}
