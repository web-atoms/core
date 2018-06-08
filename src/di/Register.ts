import { Scope, ServiceCollection } from "./ServiceCollection";

export function Register(scope: Scope = Scope.Transient): ((t: any) => void) {
    return (target: any) => {
        ServiceCollection.instance.register(target, null, scope);
    };
}
