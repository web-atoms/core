import { App } from "../App";
import Command from "../core/Command";
import EventScope from "../core/EventScope";
import FormattedString from "../core/FormattedString";
import sleep from "../core/sleep";
import { StringHelper } from "../core/StringHelper";
import { CancelToken } from "../core/types";
import XNode from "../core/XNode";
import JsonError from "../services/http/JsonError";
import { NavigationService, NotifyType } from "../services/NavigationService";
import type { AtomControl } from "../web/controls/AtomControl";
import { AtomViewModel, Watch } from "./AtomViewModel";
import { registerInit } from "./baseTypes";

export interface IActionOptions {

    /**
     * Execute current action when the specified event will be fired. The benefit is,
     * the element which has fired this event will have `[data-busy=true]` set so
     * you can use CSS to disable the button and prevent further executions.
     */
    onEvent?: string | string[] | EventScope | Command;

    /**
     * By default event is listened on current element, however some events are only sent globally
     * and might end up on parent or window. You can chagne the target by overriding this.
     */
    onEventTarget?: EventTarget;

    /**
     * When action is set to automatically execute on the given event fired,
     * if this is set to true, simultaneous executions will be blocked. Default is true.
     */
    blockMultipleExecution?: boolean;

    /**
     * Display success message after method successfully executes,
     * if method returns promise, success will display after promise
     * has finished, pass null to not display message.
     * @default null
     */
    success?: string | FormattedString | XNode;

    /**
     * Title for success message
     * @default Done
     */
    successTitle?: string;

    successMode?: "alert" | "notify";

    /**
     * By default 2000 milliseconds, the success/error notification will hide in given milliseconds
     */
    notifyDelay?: number;

    /**
     * Ask for confirmation before invoking this method
     * @default null
     */
    confirm?: string | XNode;

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

    /**
     * Authorize user, if not empty role
     */
    authorize?: string[] | boolean;
}

export interface IAuthorize {
    authorize: string[] | boolean;
    authorized: boolean;
}

const onEventHandler = (blockMultipleExecution, key) => async (ce: Event) => {
    const element = ce.currentTarget as HTMLElement;
    const c = element.atomControl;
    let target = ce.target as HTMLElement;
    if (target.getAttribute("data-busy") === "true") {
        if (blockMultipleExecution) {
            return;
        }
    }
    try {
        while(target && target !== element) {
            target.setAttribute("data-busy", "true");
            target = target.parentElement;
        }
        const detail = (ce as any).detail;
        await c[key](detail, ce);
    } finally {
        target = ce.target as HTMLElement;
        while(target && target !== element) {
            target.removeAttribute("data-busy");
            target = target.parentElement;
        }
    }
};

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
        onEvent = void 0,
        onEventTarget = void 0,
        blockMultipleExecution = true,
        authorize = void 0,
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
    return (target, key: string | symbol, descriptor: any): any => {

        if (!Array.isArray(onEvent) && typeof onEvent === "object") {
            if (onEvent instanceof Command) {
                onEvent = onEvent.eventScope.eventName;
            } else if (onEvent instanceof EventScope) {
                onEvent = onEvent.eventName;
            }
        }

        if (onEvent?.length > 0 ) {
            const oldCreate = target.beginEdit as Function;
            if(oldCreate) {
                const onEventName = Array.isArray(onEvent)
                    ? onEvent.map(StringHelper.fromHyphenToCamel)
                    : StringHelper.fromHyphenToCamel(onEvent);
                target.beginEdit = function() {

                    const result = oldCreate.apply(this, arguments);

                    // initialize here...
                    const c = this as AtomControl;
                    let element = this.element;

                    if (element) {

                        if (onEventTarget) {
                            element = onEventTarget;
                        }

                        const handler = onEventHandler(blockMultipleExecution, key);

                        if (typeof onEventName === "string") {
                            c.bindEvent(element, onEventName, handler);
                        } else {
                            for (const eventName of onEventName) {
                                c.bindEvent(element, eventName, handler);
                            }
                        }
                    }

                    return result;
                };
            }
        }

        const { value } = descriptor;
        return {
            get: function(){
                const vm = this;
                // tslint:disable-next-line: ban-types
                const oldMethod = value;
                // tslint:disable-next-line:only-arrow-functions
                const fx = async function( ... a: any[]) {
                    const vm = this;
                    const app = vm.app as App;
                    const ns = app.resolve(NavigationService) as NavigationService;
                    try {

                        if (authorize && !App.authorize()) {
                            return;
                        }

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
                            if (! await ns.confirm(confirm as any, confirmTitle || "Confirm")) {
                                return;
                            }
                        }

                        const pe = oldMethod.apply(vm, a);
                        if (pe && pe.then) {
                            const result = await pe;
                            if (close) {
                                if (success) {
                                    await ns.notify(success as any, successTitle, NotifyType.Information, notifyDelay);
                                }
                                vm.close?.(result);
                                return result;
                            }
                            if (success) {
                                if (successMode === "notify") {
                                    await ns.notify(success as any, successTitle, NotifyType.Information, notifyDelay);
                                    return result;
                                }
                                await ns.alert(success as any, successTitle);
                                return result;
                            }
                            return result;
                        }
                        if (close) {
                            if (success) {
                                await ns.notify(success as any, successTitle, NotifyType.Information, notifyDelay);
                            }
                            vm.close?.(pe);
                            return pe;
                        }
                    } catch (e) {
                        if (CancelToken.isCancelled(e)) {
                            return;
                        }
                        if (/^timeout$/i.test(e.toString().trim())) {
                            // tslint:disable-next-line: no-console
                            console.warn(e);
                            return;
                        }
                        if (e.detail) {
                            await ns.alert(e.detail, e.message);
                            return;
                        }
                        await ns.alert(e, "Error");
                    }
                };

                Object.defineProperty(vm, key, {
                    value: fx,
                    writable: true,
                    enumerable: false
                } );
                return fx;
            },
            configurable: true
        };
    };
}
