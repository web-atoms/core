import { InjectedTypes, serviceInstance } from "./InjectedTypes.js";
import { ServiceProvider } from "./ServiceProvider.js";

export interface IPropertyTypes {
    [key: string]: {new ()};
}

// export function Inject(target: any, name: string): void;
export function Inject(target: any, name: string, index?: number): void {

    if (index !== undefined) {
        const key = target;
        const plist = (Reflect as any).getMetadata("design:paramtypes", target, name);
        if (typeof index === "number") {
            const pSavedList = InjectedTypes.paramList[key] || (InjectedTypes.paramList[key] = []);

            pSavedList[index] = plist[index];
        } else {
            throw new Error("Inject can only be applied on constructor" +
                "parameter or a property without get/set methods");
        }
    } else {
        const key = name;
        Object.defineProperty(target, key, {
            get: function() {
                const plist = (Reflect as any).getMetadata("design:type", target, key);
                const result = (this.app || this[serviceInstance]).resolve(plist);
                // get is compatible with AtomWatcher
                // as it will ignore getter and it will
                // not try to set a binding refresher
                Object.defineProperty(this, key, {
                    get: () => result
                });
                return result;
            },
            configurable: true
        });
    }
}
