import { App } from "../App";
import { parsePath } from "../core/ExpressionParser";
import FormattedString from "../core/FormattedString";
import { CancelToken } from "../core/types";
import { NavigationService } from "../services/NavigationService";
import { AtomViewModel, Watch } from "./AtomViewModel";
import { registerInit } from "./baseTypes";

export interface ILoadOptions {

    /**
     * Initializes this action as soon as view model has been created.
     * If set true, success will be set to null as default.
     * @default true
     */
    init?: boolean;

    /**
     * Displays an error if error occurs during initialization, to turn it off
     * you can set to false
     * @default true
     */
    showErrorOnInit?: boolean;

    /**
     * Watch, executes this action whenever any of `this`'s properties updates,
     * this does not refresh when any property is assigned within this method.
     * Any subsequent update is ignored while the async operation is still in process.
     *
     * An automatic delay of 100 milliseconds (you can change this with watchDelayMS)
     * is applied before execution to accumulate
     * all updates and event is executed later on.
     */
    watch?: boolean;

    /**
     * Delay in milliseconds before invoking the watched expression.
     * @default 100
     */
    watchDelayMS?: number;
}

/**
 * Reports an alert to user when method is successful, or an error has occurred
 * or validation has failed. You can configure options to enable/disable certain
 * alerts.
 * @param reportOptions
 */
export default function Load(
    {
        init = false,
        showErrorOnInit = true,
        watch = false,
        watchDelayMS = 100
    }: ILoadOptions = {}) {
    // tslint:disable-next-line: only-arrow-functions
    return function(target: AtomViewModel, key: string | symbol): void {
        registerInit(target, (vm) => {
            // tslint:disable-next-line: ban-types
            const oldMethod = vm[key] as Function;
            const app = vm.app as App;
            let showError = init ? (showErrorOnInit ? true : false) : true;
            let ct: CancelToken = new CancelToken();
            const m = async (ctx?: CancelToken) => {
                const ns = app.resolve(NavigationService) as NavigationService;
                try {
                    const pe = oldMethod.call(vm, ctx);
                    if (pe && pe.then) {
                        return await pe;
                    }
                } catch (e) {
                    const s = "" + e;
                    if (/^(cancelled|canceled)$/i.test(s.trim())) {
                        // tslint:disable-next-line: no-console
                        console.warn(e);
                        return;
                    }
                    if (!showError) {
                        // tslint:disable-next-line: no-console
                        console.error(e);
                        return;
                    }
                    await ns.alert(s, "Error");
                } finally {
                    showError = true;
                }
            };

            if (watch) {
                let executing = false;
                const fx = () =>
                    app.runAsync(async () => {
                        if (ct) {
                            ct.cancel();
                        }
                        const ct2 = ct = new CancelToken();
                        if (executing) {
                            return;
                        }
                        executing = true;
                        try {
                            await m(ct2);
                        } finally {
                            executing = false;
                            ct = null;
                        }
                    });
                let timeout = null;

                // get path stripped as we are passing CancelToken, it will not
                // parse for this. expressions..
                const pathList = parsePath(oldMethod.toString(), true);
                if (pathList.length === 0) {
                    throw new Error("Nothing to watch !!");
                }
                vm.setupWatch(pathList, () => {
                    if (executing) {
                        return;
                    }
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    timeout = setTimeout(() => {
                        timeout = null;
                        fx();
                    }, watchDelayMS);
                });
                vm[key] = fx;

            } else {
                vm[key] = () => app.runAsync(() => m.call(vm));
            }

            if (init) {
                app.runAsync(() => m.call(vm, ct));
            }
        });
    };
}
