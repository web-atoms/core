import { AtomBinder } from "./AtomBinder.js";
import type { AtomComponent } from "./AtomComponent.js";
import { AtomWatcher } from "./AtomWatcher.js";

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
