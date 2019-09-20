import { App } from "../App";
import FormattedString from "../core/FormattedString";
import { NavigationService } from "../services/NavigationService";
import { AtomViewModel, Watch } from "./AtomViewModel";
import { registerInit } from "./baseTypes";

export interface IActionOptions {

    /**
     * Initializes this action as soon as view model has been created.
     * If set true, success will be set to null as default.
     * @default false
     */
    init?: boolean;

    /**
     * Displays an error if error occurs during initialization, to turn it off
     * you can set to false
     * @default true
     */
    showErrorOnInit?: boolean;

    /**
     * Display success message after method successfully executes,
     * if method returns promise, success will display after promise
     * has finished, pass null to not display message.
     * @default null if init is true, otherwise 'Operation completed successfully'
     */
    success?: string | FormattedString;

    /**
     * Title for success message
     * @default Done
     */
    successTitle?: string;

    /**
     * Ask for confirmation before invoking this method
     * @default null
     */
    confirm?: string;

    /**
     * Title for confirm message
     * @default Confirm
     */
    confirmTitle?: string;

    /**
     * Validate the view model before execution and report to user
     * @default false
     */
    validate?: boolean | string | FormattedString;

    /**
     * Title for validation
     * @default Error
     */
    validateTitle?: string;

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
export default function Action(
    {
        init = false,
        showErrorOnInit = true,
        success = init ? null : "Operation completed successfully",
        successTitle = "Done",
        confirm = null,
        confirmTitle = null,
        validate = false,
        validateTitle = null,
        watch = false,
        watchDelayMS = 100
    }: IActionOptions = {}) {
    // tslint:disable-next-line: only-arrow-functions
    return function(target: AtomViewModel, key: string | symbol): void {
        registerInit(target, (vm) => {
            // tslint:disable-next-line: ban-types
            const oldMethod = vm[key] as Function;
            const app = vm.app as App;
            let showError = init ? (showErrorOnInit ? true : false) : false;
            const m = async () => {
                const ns = app.resolve(NavigationService) as NavigationService;
                try {

                    if (validate) {
                        if (!vm.isValid) {
                            const vMsg = typeof validate === "boolean"
                                ? "Please enter correct information"
                                : validate;
                            if (!showError) {
                                // tslint:disable-next-line: no-console
                                console.error(vMsg);
                                return;
                            }
                            await ns.alert(vMsg, validateTitle || "Error");
                            return;
                        }
                    }

                    if (confirm) {
                        if (! await ns.confirm(confirm, confirmTitle || "Confirm")) {
                            return;
                        }
                    }

                    const pe = oldMethod.call(this);
                    if (pe && pe.then) {
                        const result = await pe;
                        if (success) {
                            await ns.alert(success, successTitle);
                        }
                        return result;
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
                const fx = () => app.runAsync(async () => {
                    if (executing) {
                        return;
                    }
                    executing = true;
                    try {
                        return await m.call(vm);
                    } finally {
                        executing = false;
                    }
                });
                let timeout = null;
                vm.setupWatch(oldMethod, () => {
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
                app.runAsync(() => m.apply(vm));
            }
        });
    };
}
