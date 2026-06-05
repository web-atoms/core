import { IPropertyTypes } from "./Inject.js";

export const serviceInstance = Symbol("serviceInstance");

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
            const typeKey = type;
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
            const typeKey = type;
            plist = InjectedTypes.propertyList[typeKey];
            if (!plist) {
                InjectedTypes.propertyList[typeKey] = plist;
            }
        }

        return plist;
    }

}
