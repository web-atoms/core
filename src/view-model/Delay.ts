import { AtomViewModel } from "./AtomViewModel.js";
import { registerInit, viewModelInitFunc } from "./baseTypes.js";
/**
 * Setups a timer and disposes automatically when view model is destroyed. This will execute
 * given function only once unless `repeat` argument is `true`.
 * @param delayInSeconds delay in seconds
 * @param repeat repeat at given delay
 */
export default function Delay(delayInSeconds: number, repeat: boolean = false): viewModelInitFunc {
    return (target: AtomViewModel, key: string | symbol): void => {
        registerInit(target, (vm) => {
            // tslint:disable-next-line: ban-types
            const fx: Function = (vm as any)[key];
            const afx = () => {
                vm.app.runAsync(() => fx.apply(vm));
            };
            const dx = delayInSeconds * 1000;
            const id = repeat
                ? setInterval(afx, dx)
                : setTimeout(afx, dx);
            const d = {
                dispose() {
                    if (repeat) {
                        clearInterval(id);
                    } else {
                        clearTimeout(id);
                    }
                }
            };
            vm.registerDisposable(d);
        });
    };
}
