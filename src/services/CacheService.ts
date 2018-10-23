import { App } from "../App";
import { Atom } from "../Atom";
import DISingleton from "../di/DISingleton";
import { Inject } from "../di/Inject";

export interface ICacheEntry {

    /**
     * Cache Key, must be unique
     */
    key: string;

    /**
     * Time to Live in seconds, after given ttl
     * object will be removed from cache
     */
    ttlSeconds?: number;

    /**
     * Not supported yet
     */
    expires?: Date;

    /**
     * Cached value
     */
    value?: any;
}

@DISingleton()
export default class CacheService {

    private cache: { [key: string]: ICacheEntry } = {};

    constructor(@Inject private app: App) {
    }

    public remove(key: string): any {
        const v = this.cache[key];
        if (v) {
            this.cache[key] = null;
            delete this.cache[key];
            return v.value;
        }
        return null;
    }

    public async getOrCreate<T>(
        key: string,
        task: (cacheEntry?: ICacheEntry) => Promise<T> ): Promise<T> {
        const v = this.cache[key];
        if (v && v.value) {
            return v.value;
        }
        const c: ICacheEntry = {
            key,
            ttlSeconds: 3600
        };
        c.value = await task(c);
        if (c.ttlSeconds) {
            this.cache[key] = c;
            this.app.runAsync(async () => {
                await Atom.delay(c.ttlSeconds * 1000);
                c.value = null;
                this.cache[key] = null;
                delete this.cache[key];
            });
        } else if (c.expires) {
            throw new Error("not supported");
        }
        return c.value;
    }

}
