// tslint:disable-next-line:triple-equals
if (Map == undefined) {

    interface IKVP<K, V> {
        key: K;
        value: V;
    }

    class AtomMap<K, V> {

        public get size(): number {
            return this.map.length;
        }

        private map: Array<IKVP<K, V>> = [];

        public clear(): void {
            this.map.length = 0;
        }

        public delete(key: K): boolean {
            return this.map.remove((x) => x.key === key);
        }
        public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
            for (const iterator of this.map) {
                callbackfn.call(thisArg, iterator.value, iterator.key, this);
            }
        }
        public get(key: K): V {
            const item = this.getItem(key, false);
            return item ? item.value : undefined;
        }
        public has(key: K): boolean {
            return this.map.find((x) => x.key === key) != null;
        }
        public set(key: K, value: V): this {
            const item = this.getItem(key, true);
            item.value = value;
            return this;
        }
        // public [Symbol.iterator](): IterableIterator<[K, V]> {
        //     throw new Error("Method not implemented.");
        // }
        // public keys(): IterableIterator<K> {
        //     throw new Error("Method not implemented.");
        // }
        // public values(): IterableIterator<V> {
        //     throw new Error("Method not implemented.");
        // }
        public get [Symbol.toStringTag](): string {
            return "[Map]";
        }

        private getItem(key: K, create: boolean = false): IKVP<K, V> {
            for (const iterator of this.map) {
                if (iterator.key === key) {
                    return iterator;
                }
            }
            if (create) {
                const r = { key, value: undefined };
                this.map.push(r);
                return r;
            }
        }

    }

    // tslint:disable-next-line:no-string-literal
    window["Map"] = AtomMap;

}

declare global {
    // tslint:disable-next-line:interface-name
    interface Map<K, V> {
        getOrCreate(key: K, factory: (key: K) => V): V;
    }
}

// tslint:disable-next-line:only-arrow-functions
Map.prototype.getOrCreate = function(key: any, factory: (key: any) => any): any {
    let item = this.get(key);
    if (item === undefined) {
        item = factory(key);
        this.set(key, item);
    }
    return item;
};

export default Map;
