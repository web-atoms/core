import { IClassOf } from "../core/types.js";
import { Register } from "./Register.js";
import { Scope } from "./ServiceCollection.js";

export function RegisterScoped(id: any): any {
    Register({scope: Scope.Scoped})(id);
}
