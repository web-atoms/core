import { App } from "../App";
import FormattedString from "../core/FormattedString";
import sleep from "../core/sleep";
import JsonError from "../services/http/JsonError";
import { NavigationService, NotifyType } from "../services/NavigationService";
import { AtomViewModel, Watch } from "./AtomViewModel";
import { registerInit } from "./baseTypes";

export interface IActionOptions {

    /**
     * Display success message after method successfully executes,
     * if method returns promise, success will display after promise
     * has finished, pass null to not display message.
     * @default null
     */
    success?: string | FormattedString;

    /**
     * Title for success message
     * @default Done
     */
    successTitle?: string;

    successMode?: "alert" | "notify";

    /**
     * By default 2000 miliseconds, the success/error notification will hide in given miliseconds
     */
    notifyDelay?: number;

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
     * Closes the current popup/window by calling viewModel.close, returned result will be sent in close
     */
    close?: boolean;
}

/**
 * Reports an alert to user when an error has occurred
 * or validation has failed.
 * If you set success message, it will display an alert with success message.
 * If you set confirm message, it will ask form confirmation before executing this method.
 * You can configure options to enable/disable certain
 * alerts.
 * @param reportOptions
 */
export default function Action(
    {
        success = null,
        successTitle = "Done",
        successMode = "notify",
        confirm = null,
        confirmTitle = null,
        validate = false,
        validateTitle = null,
        close = false,
        notifyDelay = 2000,
    }: IActionOptions = {}) {
    // tslint:disable-next-line: only-arrow-functions
    return function(target: AtomViewModel, key: string | symbol): void {
        registerInit(target, (vm) => {
            // tslint:disable-next-line: ban-types
            const oldMethod = vm[key] as Function;
            const app = vm.app as App;
            // tslint:disable-next-line:only-arrow-functions
            vm[key] = async function( ... a: any[]) {
                const ns = app.resolve(NavigationService) as NavigationService;
                try {

                    if (validate) {
                        if (!vm.isValid) {
                            const vMsg = typeof validate === "boolean"
                                ? "Please enter correct information"
                                : validate;
                            await ns.alert(vMsg, validateTitle || "Error");
                            return;
                        }
                    }

                    if (confirm) {
                        if (! await ns.confirm(confirm, confirmTitle || "Confirm")) {
                            return;
                        }
                    }

                    const pe = oldMethod.apply(vm, a);
                    if (pe && pe.then) {
                        const result = await pe;
                        if (close) {
                            if (success) {
                                await ns.notify(success, successTitle, NotifyType.Information, notifyDelay);
                            }
                            vm.close?.(result);
                            return result;
                        }
                        if (success) {
                            if (successMode === "notify") {
                                await ns.notify(success, successTitle, NotifyType.Information, notifyDelay);
                                return result;
                            }
                            await ns.alert(success, successTitle);
                            return result;
                    }
                        return result;
                    }
                } catch (e) {
                    if (/^(cancelled|canceled|timeout)$/i.test(e.toString().trim())) {
                        // tslint:disable-next-line: no-console
                        console.warn(e);
                        return;
                    }
                    if (e instanceof JsonError && e.json?.detail) {
                        await ns.alert(e.json.detail, e.message);
                        return;
                    }
                    await ns.alert(e, "Error");
                }
            };
        });
    };
}
