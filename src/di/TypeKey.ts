export class TypeKey {

    public static get(c: any): string {
        for (const iterator of this.keys) {
            if (iterator.c === c) {
                return iterator.key;
            }
        }
        const key = `${c.name || "key"}${this.keys.length}`;
        this.keys.push({ c, key});
        return key;
    }

    private static keys: Array<{c: any, key: string}> = [];
}

// if (Map !== undefined) {

//     const map = new Map<any, string>();

//     const oldGet = TypeKey.get;

//     TypeKey.get = (c: any): string => {
//         const v = map.get(c);
//         if (!v) {
//             return v;
//         }
//         const v1 = oldGet(c);
//         map.set(c, v1);
//         return v1;
//     };
// }
