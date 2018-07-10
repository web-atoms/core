import { IDisposable } from "./types";

export class AtomDisposableList implements IDisposable {

    // tslint:disable-next-line:ban-types
    private disposables: Function[] = [];

    // tslint:disable-next-line:ban-types
    public add(d: Function | IDisposable): void {
        if (typeof d === "function") {
            this.disposables.push(d);
            return;
        }
        this.disposables.push(() => {
            d.dispose();
        });
    }

    public dispose(): void {
        for (const iterator of this.disposables) {
            iterator();
        }
    }

}
