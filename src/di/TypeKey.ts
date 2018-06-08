export class TypeKey {

    public static get(c: any): string {
        for (const iterator of this.keys) {
            if (iterator.c === c) {
                return iterator.key;
            }
        }
        const key = `key${this.keys.length}`;
        this.keys.push({ c, key});
        return key;
    }

    private static keys: Array<{c: any, key: string}> = [];
}
