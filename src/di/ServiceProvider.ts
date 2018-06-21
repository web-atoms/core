import { IClassOf, IDisposable } from "../core/types";
import { InjectedTypes } from "./Inject";
import { Scope, ServiceCollection, ServiceDescription } from "./ServiceCollection";
import { TypeKey } from "./TypeKey";

export class ServiceProvider implements IDisposable {

    public static global: ServiceProvider = new ServiceProvider(null);

    private static providers: { [key: string]: any } = {};

    private instances: { [key: string]: any } = {};

    private constructor(public parent: ServiceProvider) {
        if (parent === null) {
            ServiceCollection.instance.registerScoped(ServiceProvider);
        }
        const sd = ServiceCollection.instance.get(ServiceProvider);
        this.instances[sd.id] = this;
    }

    public get<T>(key: IClassOf<T>): T {
        return this.resolve(key, true);
    }

    public put(key: any, value: any): void {
        const sd = ServiceCollection.instance.get(key);
        this.instances[sd.id] = value;
    }

    public resolve(key: any, create: boolean = false): any {
        const sd = ServiceCollection.instance.get(key);

        if (!sd) {
            if (!create) {
                throw new Error(`No service registered for type ${key}`);
            }

            return this.create(key);
        }

        if (sd.scope === Scope.Global) {
            return ServiceProvider.global.getValue(sd);
        }
        if (sd.scope === Scope.Scoped) {
            if (sd.type === ServiceProvider) {
                return this;
            }
            if (this.parent === null) {
                throw new Error("Scoped dependency cannot be created on global");
            }
        }

        return this.getValue(sd);
    }

    public getValue(sd: ServiceDescription): any {
        if (sd.scope === Scope.Transient) {
            return sd.factory(this);
        }

        let v: any = this.instances[sd.id];
        if (!v) {
            this.instances[sd.id] = v = sd.factory(this);
        }
        return v;
    }

    public newScope(): ServiceProvider {
        return new ServiceProvider(this);
    }

    public dispose(): void {
        for (const key in this.instances) {
            if (this.instances.hasOwnProperty(key)) {
                const element = this.instances[key];
                const d = element as IDisposable;
                if (d.dispose) {
                    d.dispose();
                }
            }
        }
    }

    private create(key: any): any {

        const plist = InjectedTypes.paramList[TypeKey.get(key)];

        if (plist) {
            const pv = plist.map( (x) => this.resolve(x) );
            pv.unshift(null);
            return new (key.bind.apply(key, pv))();
        }
        const v = new (key)();
        return v;
    }

}
