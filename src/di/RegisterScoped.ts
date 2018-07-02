import { IClassOf } from "../core/types";
import { Register } from "./Register";
import { Scope } from "./ServiceCollection";

export function RegisterScoped(id: any): any {
    Register({scope: Scope.Scoped})(id);
}
