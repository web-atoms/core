import { TypeKey } from "../di/TypeKey";

export class PropertyMap {

    // tslint:disable-next-line:ban-types
    public static from(o: any): PropertyMap {
        const c = Object.getPrototypeOf(o);
        const key = TypeKey.get(c);
        const map = PropertyMap.map;
        const m = map[key] || (map[key] = new PropertyMap(c));
        return m;
    }

    private static map: { [key: string]: PropertyMap } = {};

    constructor(c: any) {
        while (c) {
            for (const name of Object.getOwnPropertyNames(c)) {
                this[name] = true;
            }
            c = Object.getPrototypeOf(c);
        }
    }
}
