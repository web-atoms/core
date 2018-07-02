import { IClassOf } from "../core/types";
import { Register } from "./Register";
import { Scope } from "./ServiceCollection";

export function RegisterSingleton(target: any): void {
    Register({scope: Scope.Global})(target);
}
