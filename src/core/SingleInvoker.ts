import DITransient from "../di/DITransient";
import TransientDisposable from "./TransientDisposable";
import { IDisposable } from "./types";

@DITransient()
export default class SingleInvoker extends TransientDisposable {

    private keys = new Map<string, number>();

    public dispose() {
        for (const [key, index] of this.keys.entries()) {
            clearTimeout(index);
        }
        this.keys.clear();
    }

    // tslint:disable-next-line: ban-types
    public invoke(key: string, fx: Function, delay: number = 100): void {
        const keys = this.keys;
        const e = keys.get(key);
        if (e) {
            clearTimeout(e);
        }
        keys.set(key, setTimeout(() => {
            keys.delete(key);
            fx();
        }, delay));
    }

    // tslint:disable-next-line: ban-types
    public queue(fx: Function, delay: number = 1, key?: string ): void {
        key ??= fx.toString();
        const keys = this.keys;
        const e = keys.get(key);
        if (e) {
            clearTimeout(e);
        }
        keys.set(key, setTimeout(() => {
            keys.delete(key);
            fx();
        }, delay));
    }

}
