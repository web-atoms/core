import { Scope, ServiceCollection } from "./ServiceCollection";

export interface IServiceDef {
    id?: string;
    scope: Scope;
    for?: any;
}

export function Register(def: IServiceDef): ((t: any) => void);
export function Register(id: string, scope: Scope): ((t: any) => void);
export function Register(id: string | IServiceDef, scope?: Scope): ((t: any) => void) {
    return (target: any) => {
        if (typeof id === "object") {
            if (scope) {
                id.scope = scope;
            }
            ServiceCollection.instance.register(id.for || target, id.for ? (sp) => (sp as any).create(target) : null,
                id.scope || Scope.Transient, id.id);
            return;
        }
        ServiceCollection.instance.register(target, null, scope, id);
    };
}
