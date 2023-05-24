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

export type onEventSetBusyTypes = "target" | "current-target" | "till-current-target" | "ancestors" | "button";

export interface IActionOptions {

    /**
     * Execute current action when the specified event will be fired. The benefit is,
     * the element which has fired this event will have `[data-busy=true]` set so
     * you can use CSS to disable the button and prevent further executions.
     */
    onEvent?: string | string[] | EventScope | EventScope[] | Command | Command[];

    /**
     * By default event is listened on current element, however some events are only sent globally
     * and might end up on parent or window. You can chagne the target by overriding this.
     */
    onEventTarget?: EventTarget;

    /**
     * Set busy will be set to only target of the event. You can change this behavior by providing
     * any of target, current-target, ancestors, button. Ancestors will set all ancestors to busy.
     * `button` will only set busy if target is button or any ancestor is button.
     */

    onEventSetBusy?: MarkBusySet;

    /**
     * Defer the execution for given milliseconds, each execution request made before the defer
     * will cancel previous request and will enqueue the new request. This is helpful in 
     * preventing multiple simultaneous executions.
     */
    defer?: number;

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

export class MarkBusySet {

    public static none = new MarkBusySet(function*() {
    })

    public static target = new MarkBusySet(function* (t, ct) {
        yield t;
    });

    public static currentTarget = new MarkBusySet(function* (t, ct) {
        yield ct;
    });


    public static tillCurrentTarget = new MarkBusySet(function*(target, currentTarget) {
        let start = target;
        do {
            yield start;
            start = start.parentElement;
        } while (start !== currentTarget);
        yield currentTarget;
    });

    public static button = new MarkBusySet(function *(target, currentTarget) {
        let start = target;
        while (start) {
            if (start.tagName === "BUTTON") {
                yield start;
                break;
            }
            start = start.parentElement;
        }
    });

    public static buttonOrAnchor = new MarkBusySet(function *(target, currentTarget) {
        let start = target;
        while (start) {
            if (start.tagName === "BUTTON" || start.tagName === "A") {
                yield start;
                break;
            }
            start = start.parentElement;
        }
    });

    public static selector(selector: string) {
        return new MarkBusySet(function *(target, currentTarget) {
            let start = target;
            while (start) {
                if (start.matches(selector)) {
                    yield start;
                    break;
                }
                start = start.parentElement;
            }
        });
    }


    public static allAncestors = new MarkBusySet(function*(target, currentTarget) {
        do {
            yield target;
            target = target.parentElement;
        } while (target);
    });

    private constructor(private set: (target: HTMLElement, currentTarget: HTMLElement) => Iterable<HTMLElement>) {

    }

    public *find(event: Event) {
        yield *this.set(event.target as HTMLElement, event.currentTarget as HTMLElement);
    }

}

// function *findAll(element: HTMLElement, currentTarget: HTMLElement, onEventSetBusy: onEventSetBusyTypes) {
//     let start = element;
//     switch(onEventSetBusy) {
//         case "target":
//             yield start;
//             return;
//         case "current-target":
//             yield currentTarget;
//             return;
//         case "button":
//             while (start) {
//                 if (start.tagName === "BUTTON") {
//                     yield start;
//                     return;
//                 }
//                 start = start.parentElement;
//             }
//             return;
//         case "ancestors":
//             while(start) {
//                 yield start;
//                 start = start.parentElement;
//             }
//             return;
//         case "till-current-target":
//             do {
//                 yield start;
//                 start = start.parentElement;
//             } while (start)
//             return;
//     }
// }

const onEventHandler = (owner, blockMultipleExecution, key, busyKey: symbol, onEventSetBusy: MarkBusySet) => async (ce: Event) => {
    const element = ce.currentTarget as HTMLElement;
    if (owner[busyKey]) {
        if (blockMultipleExecution) {
            return;
        }
    }
    owner[busyKey] = true;
    try {
        if (onEventSetBusy) {
            for (const iterator of onEventSetBusy.find(ce)) {
                iterator.setAttribute("data-busy", "true");
            }
        }
        const detail = (ce as any).detail;
        return await owner[key](detail, ce);
    } finally {
        delete owner[busyKey];
        if(onEventSetBusy) {
            for (const iterator of onEventSetBusy.find(ce)) {
                iterator.removeAttribute("data-busy");
            }
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
        onEventSetBusy,
        blockMultipleExecution = true,
        authorize = void 0,
        defer = void 0,
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

        const getEventNames = (names: string | Command | EventScope | (string | Command | EventScope)[]): string | string[] => {
            if (names === null || names === void 0) {
                return;
            }
            if (Array.isArray(names)) {
                return names.map(getEventNames) as any;
            }
            if(names instanceof Command) {
                onEventTarget ??= window;
                return names.eventScope.eventType;
            }
            if (names instanceof EventScope) {
                onEventTarget ??= window;
                return names.eventType;
            }
            return names;
        }
        

        onEvent = getEventNames(onEvent);

        if (onEvent?.length > 0 ) {
            const oldCreate = target.beginEdit as Function;
            if(oldCreate) {
                const onEventName = Array.isArray(onEvent)
                    ? onEvent.map(StringHelper.fromHyphenToCamel)
                    : StringHelper.fromHyphenToCamel(onEvent);
                const busyKey = Symbol.for("isBusy" + key.toString());
                target.beginEdit = function() {

                    const result = oldCreate.apply(this, arguments);

                    // initialize here...
                    const c = this as AtomControl;
                    let element = this.element;

                    if (element) {

                        if (onEventTarget) {
                            element = onEventTarget;
                        }

                        const handler = onEventHandler(c, blockMultipleExecution, key, busyKey, onEventSetBusy);

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

        const deferSymbol = defer ? Symbol.for(`${key.toString()}Defer`) : void 0;

        return {
            get: function(){
                const vm = this;
                
                // tslint:disable-next-line: ban-types
                const oldMethod = value;
                // tslint:disable-next-line:only-arrow-functions
                const fx = async function( ... a: any[]) {
                    const vm = this;

                    if (defer) {
                        const previous = vm[deferSymbol];
                        if (previous === void 0 || previous > 0) {
                            if (previous > 0) {
                                clearTimeout(previous);
                            }
                            vm[deferSymbol] = setTimeout(() => {
                                vm[deferSymbol] = 0;
                                return vm[key](... a);
                            }, defer);
                            return;
                        }
                    }

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
