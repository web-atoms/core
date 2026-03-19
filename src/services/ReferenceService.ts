import DISingleton from "../di/DISingleton.js";

export class ObjectReference {

    public consume: () => any;

    public timeout: any;

    constructor(public key: string, public value: any) {}

}

@DISingleton()
export default class ReferenceService {

    private cache: { [key: string]: any} = {};

    private id: number = 1;

    public get(key: string): ObjectReference {
        return this.cache[key];
    }

    public put(item: any, ttl: number = 60): ObjectReference {
        const key = `k${this.id++}`;
        const r = new ObjectReference(key, item);
        r.consume = () => {
            delete this.cache[key];
            if (r.timeout) {
                clearTimeout(r.timeout);
            }
            return r.value;
        };
        r.timeout = setTimeout(() => {
            r.timeout = 0;
            r.consume();
        }, ttl * 1000);
        this.cache[key] = r;
        return r;
    }

}
