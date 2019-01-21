import { ArrayHelper } from "../core/types";
import { ServiceProvider } from "./ServiceProvider";
import { TypeKey } from "./TypeKey";

export type ServiceFactory = (sp: ServiceProvider) => any;

export enum Scope {
    Global = 1,
    Scoped = 2,
    Transient = 3
}

export class ServiceDescription {

    constructor(
        public id: string,
        public scope: Scope,
        public type: any,
        public factory: ServiceFactory
    ) {
        this.factory = this.factory || ((sp) => {
            return (sp as any).create(type);
        });
    }

}

export class ServiceCollection {

    public static instance: ServiceCollection = new ServiceCollection();

    private registrations: ServiceDescription[] = [];

    private ids: number = 1;

    public register(
        type: any,
        factory: ServiceFactory,
        scope: Scope = Scope.Transient,
        id?: string): ServiceDescription {
        ArrayHelper.remove(this.registrations, (r) => id ? r.id === id : r.type === type);
        if (!id) {
            id = TypeKey.get(type) + this.ids;
            this.ids ++;
        }
        const sd = new ServiceDescription(id, scope, type, factory);
        this.registrations.push(sd);
        return sd;
    }

    public registerScoped(type: any, factory?: ServiceFactory, id?: string): ServiceDescription {
        return this.register(type, factory, Scope.Scoped, id);
    }

    public registerSingleton(type: any, factory?: ServiceFactory, id?: string): ServiceDescription {
        return this.register(type, factory, Scope.Global, id);
    }

    public get(type: any): ServiceDescription {
        return this.registrations.find( (s) => s.id === type || s.type === type);
    }
}
