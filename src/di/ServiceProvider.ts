import TransientDisposable from "../core/TransientDisposable";
import { DI, IAnyInstanceType, IClassOf, IDisposable } from "../core/types";
import { InjectedTypes } from "./Inject";
import { Scope, ServiceCollection, ServiceDescription } from "./ServiceCollection";
import { TypeKey } from "./TypeKey";

export class ServiceProvider implements IDisposable {

    private static mappedTypes: Map<string, any> = new Map();

    private instances: Map<string, any> = new Map();

    public get global(): ServiceProvider {
        return this.parent === null ? this : this.parent.global;
    }

    protected constructor(public parent: ServiceProvider) {
        if (parent === null) {
            ServiceCollection.instance.registerScoped(ServiceProvider);
        }
        const sd = ServiceCollection.instance.get(ServiceProvider);
        this.instances.set(sd.id, this);
    }

    public get<T>(key: IClassOf<T>): T {
        return this.resolve(key, true);
    }

    public put(key: any, value: any): void {
        let sd = ServiceCollection.instance.get(key);
        if (!sd) {
            sd = ServiceCollection.instance.register(key, () => value, Scope.Global);
        }
        this.instances.set(sd.id, value);
    }

    public resolve<T>(
        key: T, create: boolean = false, defValue?: IAnyInstanceType<T>): IAnyInstanceType<T> {
        const sd = ServiceCollection.instance.get(key);

        if (!sd) {
            if (!create) {
                if (defValue !== undefined) {
                    return defValue;
                }
                throw new Error(`No service registered for type ${key}`);
            }

            return this.create(key);
        }

        if (sd.type === ServiceProvider) {
            return this as any;
        }

        if (sd.scope === Scope.Global) {
            return this.global.getValue(sd);
        }

        if (sd.scope === Scope.Scoped) {
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

        let v: any = this.instances.get(sd.id);
        if (v === void 0) {
            v = sd.factory(this);
            this.instances.set(sd.id, v);
        }
        return v;
    }

    public newScope(): ServiceProvider {
        return new ServiceProvider(this);
    }

    public dispose(): void {
        for (const element of this.instances.values()) {
            if (element === this) {
                continue;
            }
            element.dispose?.();
        }
        this.instances.clear();
    }

    private create(key: any): any {

        const originalKey = key;
        const originalTypeKey = TypeKey.get(originalKey);

        if (DI.resolveType) {
            let mappedType = ServiceProvider.mappedTypes.get(originalTypeKey);
            if (mappedType === void 0) {
                mappedType = DI.resolveType(originalKey);
                ServiceProvider.mappedTypes.set(originalKey, mappedType);
            }

            key = mappedType;
        }
        const typeKey1 = TypeKey.get(key);

        const plist = InjectedTypes.getParamList(key, typeKey1);

        let value: any = null;

        if (plist) {
            const pv = plist.map( (x) => x ? this.resolve(x) : (void 0) );
            pv.unshift(null);
            value = new (key.bind.apply(key, pv))();
            for (const iterator of pv) {
                if (iterator && iterator instanceof TransientDisposable) {
                    iterator.registerIn(value);
                }
            }
        } else {
            value = new (key)();
        }

        const propList = InjectedTypes.getPropertyList(key, typeKey1);
        if (propList) {
            for (const key1 in propList) {
                if (propList.hasOwnProperty(key1)) {
                    const element = propList[key1];
                    const d = this.resolve(element);
                    value[key1] = d;
                    if (d && d instanceof TransientDisposable) {
                        d.registerIn(value);
                    }
                }
            }
        }

        return value;
    }

}
