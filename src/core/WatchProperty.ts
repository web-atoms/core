import { AtomBinder } from "./AtomBinder";
import type { AtomComponent } from "./AtomComponent";
import { AtomWatcher } from "./AtomWatcher";

export default function WatchProperty(target: AtomComponent, key: string, descriptor: any): any {

    const { get } = descriptor;
    const isSetup = Symbol.for(`isSetup${key}`);
    return {
        // tslint:disable-next-line: object-literal-shorthand
        get: function() {
            const watcher = new AtomWatcher(this, get, () => {
                AtomBinder.refreshValue(this, key);
            }, this);
            watcher.init(false);
            this.registerDisposable(watcher);
            this[isSetup] = watcher;
            Object.defineProperty(this, key, descriptor);
            return get.apply(this);
        },
        configurable: true
    };
}
