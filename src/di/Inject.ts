import { TypeKey } from "./TypeKey";

export interface IPropertyTypes {
    [key: string]: {new ()};
}

export class InjectedTypes {

    public static paramList: {
        [key: string]: Array<{ new ()}>
    } = {};

    public static propertyList: {
        [key: string]: IPropertyTypes
    } = {};

    public static getParamList(key: any, typeKey1: any): Array<{ new ()}> {
        let plist = InjectedTypes.paramList[typeKey1];

        // We need to find @Inject for base types if
        // current type does not define any constructor
        let type = key;
        while (plist === undefined) {
            type = Object.getPrototypeOf(type);
            if (!type) {
                break;
            }
            const typeKey = TypeKey.get(type);
            plist = InjectedTypes.paramList[typeKey];
            if (!plist) {
                InjectedTypes.paramList[typeKey] = plist;
            }
        }

        return plist;
    }

    public static getPropertyList(key: any, typeKey1: any): IPropertyTypes {
        let plist = InjectedTypes.propertyList[typeKey1];

        // We need to find @Inject for base types if
        // current type does not define any constructor
        let type = key;
        while (plist === undefined) {
            type = Object.getPrototypeOf(type);
            if (!type) {
                break;
            }
            const typeKey = TypeKey.get(type);
            plist = InjectedTypes.propertyList[typeKey];
            if (!plist) {
                InjectedTypes.propertyList[typeKey] = plist;
            }
        }

        return plist;
    }

}

// export function Inject(target: any, name: string): void;
export function Inject(target: any, name: string, index?: number): void {
    const key = TypeKey.get(target);

    if (index !== undefined) {
        const plist = (Reflect as any).getMetadata("design:paramtypes", target, name);
        if (typeof index === "number") {
            const pSavedList = InjectedTypes.paramList[key] || (InjectedTypes.paramList[key] = []);

            pSavedList[index] = plist[index];
        } else {
            throw new Error("Inject can only be applied on constructor" +
                "parameter or a property without get/set methods");
        }
    } else {
        const prot = Object.getPrototypeOf(target);
        const plist = (Reflect as any).getMetadata("design:type", prot, name);
        const p = InjectedTypes.propertyList[key] || (InjectedTypes.propertyList[key] = {});
        p[name] = plist;
        // tslint:disable-next-line:no-debugger
        debugger;
    }
}
