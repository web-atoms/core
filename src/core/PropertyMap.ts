import { TypeKey } from "../di/TypeKey";

export interface IPropertyMap {
    [key: string]: boolean;
}

export class PropertyMap {

    // tslint:disable-next-line:ban-types
    public static from(o: any): PropertyMap {
        const c = Object.getPrototypeOf(o);
        const key = TypeKey.get(c);
        const map = PropertyMap.map;
        const m = map[key] || (map[key] = PropertyMap.createMap(o));
        return m;
    }

    private static map: { [key: string]: PropertyMap } = {};

    private static createMap(c: any): PropertyMap {
        const map: IPropertyMap = {};
        const nameList: string[] = [];
        while (c) {
            const names = Object.getOwnPropertyNames(c);
            for (const name of names) {
                if (/hasOwnProperty|constructor|toString|isValid|errors/i.test(name)) {
                    continue;
                }
                // // map[name] = Object.getOwnPropertyDescriptor(c, name) ? true : false;
                // const pd = Object.getOwnPropertyDescriptor(c, name);
                // // tslint:disable-next-line:no-console
                // console.log(`${name} = ${c.enumerable}`);
                map[name] = true;
                nameList.push(name);
            }
            c = Object.getPrototypeOf(c);
        }
        const m = new PropertyMap();
        m.map = map;
        m.names = nameList;
        return m;
    }

    public names: string[];

    public map: IPropertyMap;

}
