import DITransient from "../di/DITransient";
import TransientDisposable from "./TransientDisposable";
import { IDisposable } from "./types";

@DITransient()
export default class SingleInvoker extends TransientDisposable {

    private keys: {[key: string]: any} = {};

    public dispose() {
        for (const key in this.keys) {
            if (this.keys.hasOwnProperty(key)) {
                const element = this.keys[key];
                clearTimeout(element);
            }
        }
    }

    // tslint:disable-next-line: ban-types
    public invoke(key: string, fx: Function, delay: number = 100): void {
        const keys = this.keys;
        const e = keys[key];
        if (e) {
            clearTimeout(e);
        }
        keys[key] = setTimeout(fx, delay);
    }

}
