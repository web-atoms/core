import { DI } from "../core/types";
import { IMockOrInject } from "./IMockOrInject";
import { Scope, ServiceCollection } from "./ServiceCollection";

export interface IServiceDef {
    id?: string;
    scope: Scope;
    for?: any;
    mockOrInject?: IMockOrInject;
}

declare var global: any;
declare var window: any;

const globalNS = (typeof global === "undefined") ? window : global;

function evalGlobal(path: string | any) {
    if (typeof path === "string") {
        let r = globalNS;
        for (const iterator of path.split(".")) {
            r = r[iterator];
            if (r === undefined || r === null) {
                return r;
            }
        }
        return r;
    }
    return path;
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

            if (id.mockOrInject) {
                if (id.mockOrInject.inject) {
                    DI.inject(target, id.mockOrInject.inject);
                } else if (id.mockOrInject.mock) {
                    DI.mockType(target, id.mockOrInject.mock);
                } else if (id.mockOrInject.globalVar) {
                    ServiceCollection.instance.register(
                        id.for || target, (sp) => evalGlobal(id.mockOrInject.globalVar),
                        id.scope || Scope.Global, id.id);
                }
            }

            return;
        }
        ServiceCollection.instance.register(target, null, scope, id);
    };
}
