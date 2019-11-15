import { AtomDisposableList } from "../core/AtomDisposableList";
import { AtomOnce } from "../core/AtomOnce";
import { AtomUri } from "../core/AtomUri";
import { IDisposable } from "../core/types";
import { AtomViewModel } from "./AtomViewModel";
/**
 * Binds property of View Model to URL Parameter, it can read query string as well,
 * however it will only persist value in hash
 * @param vm View Model
 * @param name property name of View Model
 * @param urlParameter url parameter name
 */
export default function bindUrlParameter(vm: AtomViewModel, name: string, urlParameter: string): IDisposable {
    if (!name) {
        return;
    }
    if (!urlParameter) {
        return;
    }
    const a = vm as any;
    const paramDisposables = (a.mUrlParameters || (a.mUrlParameters = {}));
    const old = paramDisposables[name];
    if (old) {
        old.dispose();
        paramDisposables[name] = null;
    }
    const disposables = new AtomDisposableList();
    const updater = new AtomOnce();
    disposables.add(a.setupWatch([
        ["app", "url", "hash", urlParameter],
        ["app", "url", "query", urlParameter]
    ], (hash, query) => {
        updater.run(() => {
            const value = hash || query;
            if (value) {
                // tslint:disable-next-line:triple-equals
                if (value != vm[name]) {
                    vm[name] = value;
                }
            }
        });
    }));
    disposables.add(a.setupWatch([[name]], (value) => {
        updater.run(() => {
            const url = vm.app.url || (vm.app.url = new AtomUri(""));
            url.hash[urlParameter] = value;
            vm.app.syncUrl();
        });
    }));
    paramDisposables[name] = disposables;
    if (this.app.url) {
        vm[name] = this.app.url.hash[urlParameter] || this.app.url.query[urlParameter];
    }
    return vm.registerDisposable(disposables);
}
