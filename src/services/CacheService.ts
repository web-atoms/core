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

    /**
     * Not supported yet
     */
    expires?: Date;

    /**
     * Cached value
     */
    value?: any;

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
            this.cache[key] = null;
            delete this.cache[key];
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
            this.cache[key] = c;
            c.value = await task(c);
            if (c.ttlSeconds !== undefined) {
                if (typeof c.ttlSeconds === "number") {
                    c.finalTTL = c.ttlSeconds;
                } else {
                    c.finalTTL = c.ttlSeconds(c.value);
                }
            }
        }
        if (c.timeout) {
            clearTimeout(c.timeout);
        }
        if (c.finalTTL) {
            this.cache[key] = c;
            c.timeout = setTimeout(() => {
                this.cache[key] = null;
                c.timeout = 0;
                delete this.cache[key];
            }, c.finalTTL);

        } else if (c.expires) {
            throw new Error("not supported");
        }
        return c.value;
    }

}
