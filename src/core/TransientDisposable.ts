import { IDisposable } from "./types.js";

export default abstract class TransientDisposable implements IDisposable {

    constructor(owner?: any) {
        if (owner) {
            this.registerIn(owner);
        }
    }

    public abstract dispose();

    public registerIn(value: any) {
        const v = value.disposables;
        if (v) {
            v.push(this);
        } else {
            if (value.registerDisposable) {
                value.registerDisposable(this);
            }
        }
    }

}
