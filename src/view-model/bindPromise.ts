import { AtomBinder } from "../core/AtomBinder";
import { NavigationService, NotifyType } from "../services/NavigationService";
import { AtomViewModel } from "./AtomViewModel";
/**
 * Use this method to create an object/array that will refresh
 * when promise is resolved
 */
export function bindPromise<T extends any | any[]>(
    vm: AtomViewModel,
    p: Promise<T>,
    value: any,
    displayError: boolean | ((e) => void) = true): T {
    p.then((v) => {
        if (Array.isArray(v)) {
            const a = value as any;
            (a as any[]).replace(v as any);
        } else {
            for (const key in v) {
                if (v.hasOwnProperty(key)) {
                    const element = v[key];
                    value[key] = element;
                    AtomBinder.refreshValue(value, key);
                }
            }
        }
    }).catch((e) => {
        if (displayError) {
            if (typeof displayError === "function") {
                displayError(e);
            } else {
                const n = vm.app.resolve(NavigationService) as NavigationService;
                n.notify(e, "Error", NotifyType.Error);
            }
        }
    });
    return value;
}
