import { IDisposable } from "./types";

export class AtomDisposableList implements IDisposable {

    // tslint:disable-next-line:ban-types
    private disposables: IDisposable[] = [];

    // tslint:disable-next-line:ban-types
    public add(d: Function | IDisposable): IDisposable {
        if (typeof d === "function") {
            const fx = d;
            d = {
                dispose: () => {
                    fx();
                }
            };
        }
        this.disposables.push(d);
        const dx = d;
        return {
            dispose: () => {
                this.disposables = this.disposables.filter((x) => x !== dx);
                dx.dispose();
            }
        };
    }

    public dispose(): void {
        for (const iterator of this.disposables) {
            iterator.dispose();
        }
    }

}
