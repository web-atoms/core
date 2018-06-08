import { Register } from "./Register";
import { Scope } from "./ServiceCollection";

export function RegisterSingleton(target: any): void {
    Register(Scope.Global)(target);
}
