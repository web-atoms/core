import { App } from "../App";
import { parsePath } from "../core/ExpressionParser";
import FormattedString from "../core/FormattedString";
import { CancelToken } from "../core/types";
import { NavigationService } from "../services/NavigationService";
import { AtomViewModel, Watch } from "./AtomViewModel";
import { registerInit } from "./baseTypes";

export type ILoadOptions = {

    /**
     * Initializes this action as soon as view model has been created.
     * If set true, success will be set to null as default.
     * @default true
     */
    init: true;

    /**
     * Displays an error if error occurs during initialization, to turn it off
     * you can set to false
     * @default true
     */
    showErrorOnInit?: boolean;

    watch?: false;

    watchDelayMS?: never;

} | {

    init?: false;

    showErrorOnInit?: false;

    /**
     * Watch, executes this action whenever any of `this`'s properties updates,
     * this does not refresh when any property is assigned within this method.
     * Any subsequent update is ignored while the async operation is still in process.
     *
     * An automatic delay of 100 milliseconds (you can change this with watchDelayMS)
     * is applied before execution to accumulate
     * all updates and event is executed later on.
     */
    watch: true;

    /**
     * Delay in milliseconds before invoking the watched expression.
     * @default 100
     */
    watchDelayMS?: number;
} | {
    init: true;
    showErrorOnInit?: boolean;
    watch: true;
    watchDelayMS?: number;
} | never;

/**
 * Loads given method on based on init/watch properties.
 * If init is true, method will be executed when view model is initialized.
 * If watch is true, method will be executed when any of `this.*.*` properties are
 * modified. This method can be asynchronous. Watch will ignore all assignment
 * changes within the method.
 *
 * Every execution will be delayed by parameter specified in {@link ILoadOptions#watchDelayMS},
 * so multiple calls can be accumulated and only one final execution will proceed. This is useful
 * when you want to load items from API when user is continuously typing in search box.
 *
 * Method will have an input parameter for cancelToken {@link CancelToken} which you
 * can pass it to any REST Api call, before executing next method, cancelToken will
 * cancel previous execution.
 *
 * Either init or watch has to be true, or both can be true as well.
 */
export default function Load(
    {
        init,
        showErrorOnInit,
        watch,
        watchDelayMS
    }: ILoadOptions) {
    // tslint:disable-next-line: only-arrow-functions
    return function(target: AtomViewModel, key: string | symbol): void {
        registerInit(target, (vm) => {
            // tslint:disable-next-line: ban-types
            const oldMethod = vm[key] as Function;
            const app = vm.app as App;
            let showError = init ? (showErrorOnInit ? true : false) : true;
            let ct: CancelToken = new CancelToken();

            /**
             * For the special case of init and watch both are true,
             * we need to make sure that watch is ignored for first run
             *
             * So executing is set to true for the first time
             */
            let executing = init;
            const m = async (ctx?: CancelToken) => {
                const ns = app.resolve(NavigationService) as NavigationService;
                try {
                    const pe = oldMethod.call(vm, ctx);
                    if (pe && pe.then) {
                        return await pe;
                    }
                } catch (e) {
                    if (/^(cancelled|canceled)$/i.test(e.toString().trim())) {
                        // tslint:disable-next-line: no-console
                        console.warn(e);
                        return;
                    }
                    if (!showError) {
                        // tslint:disable-next-line: no-console
                        console.error(e);
                        return;
                    }
                    await ns.alert(e, "Error");
                } finally {
                    showError = true;
                    executing = false;
                }
            };

            if (watch) {
                const fx = () =>
                    app.runAsync(async () => {
                        if (ct) { ct.cancel(); }
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
                    }, watchDelayMS || 100);
                });
                vm[key] = fx;

            }

            if (init) {
                app.runAsync(() => m.call(vm, ct));
            }
        });
    };
}
