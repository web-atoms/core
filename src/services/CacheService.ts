import { App } from "../App";
import { Atom } from "../Atom";
import DISingleton from "../di/DISingleton";
import { Inject } from "../di/Inject";

export type CacheSeconds<T> = number | ((result: T) => number);
export interface ICacheEntry<T> {

    /**
     * Cache Key, must be unique
     */
    key: string;

    /**
     * Time to Live in seconds, after given ttl
     * object will be removed from cache
     */
    ttlSeconds?: CacheSeconds<T>;

    // /**
    //  * Not supported yet
    //  */
    // expires?: Date;

    /**
     * Cached value
     */
    value?: Promise<any>;

}

interface IFinalCacheEntry extends ICacheEntry<any> {

    finalTTL?: number;

    timeout?: any;

}

@DISingleton()
export default class CacheService {

    private cache: { [key: string]: IFinalCacheEntry } = {};

    constructor(@Inject private app: App) {
    }

    public remove(key: string): any {
        const v = this.cache[key];
        if (v) {
            this.clear(v);
            return v.value;
        }
        return null;
    }

    public async getOrCreate<T>(
        key: string,
        task: (cacheEntry?: ICacheEntry<T>) => Promise<T> ): Promise<T> {
        const c = this.cache[key] || {
            key,
            finalTTL: 3600
        };
        if (!c.value) {
            c.value = task(c);
        }
        try {
            await c.value;
        } catch (e) {
            this.clear(c);
            throw e;
        }
        if (c.ttlSeconds !== undefined) {
            if (typeof c.ttlSeconds === "number") {
                c.finalTTL = c.ttlSeconds;
            } else {
                c.finalTTL = c.ttlSeconds(c.value);
            }
        }
        if (c.timeout) {
            clearTimeout(c.timeout);
        }
        if (c.finalTTL) {
            this.cache[key] = c;
            c.timeout = setTimeout(() => {
                c.timeout = 0;
                this.clear(c);
            }, c.finalTTL * 1000);
        }
        return await c.value;
    }

    private clear(ci: IFinalCacheEntry): void {
        if (ci.timeout) {
            clearTimeout(ci.timeout);
            ci.timeout = 0;
        }
        this.cache[ci.key] = null;
        delete this.cache[ci.key];
    }

}
