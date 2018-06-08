import { Register } from "./Register";
import { Scope } from "./ServiceCollection";

export function RegisterScoped(target: any): void {
    Register(Scope.Scoped)(target);
}
