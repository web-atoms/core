import { IDisposable } from "./types";

export default abstract class TransientDisposable implements IDisposable {

    public abstract dispose();

    public registerIn(value: any) {
        const v = value.disposables;
        if (v) {
            v.push(this);
        } else {
            if (v.registerDisposable) {
                v.registerDisposable(this);
            }
        }
    }

}
