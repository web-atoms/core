import { Scope, ServiceCollection } from "./ServiceCollection";

export interface IServiceDef {
    id?: string;
    scope: Scope;
}

export function Register(def: IServiceDef): ((t: any) => void);
export function Register(id: string, scope: Scope): ((t: any) => void);
export function Register(id: string | IServiceDef, scope?: Scope): ((t: any) => void) {
    return (target: any) => {
        if (typeof id === "string") {
            ServiceCollection.instance.register(target, null, scope, id);
            return;
        }
        ServiceCollection.instance.register(target, null, id.scope || Scope.Transient, id.id);
    };
}
