import { IClassOf } from "../core/types.js";
import { Register } from "./Register.js";
import { Scope } from "./ServiceCollection.js";

export function RegisterSingleton(target: any): void {
    Register({scope: Scope.Global})(target);
}
