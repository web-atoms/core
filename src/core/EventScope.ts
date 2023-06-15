import DateTime from "@web-atoms/date-time/dist/DateTime";
import { CancelToken, IDisposable } from "./types";
import type { AtomControl } from "../web/controls/AtomControl";

const key = DateTime.now.msSinceEpoch;
let id = 1;

export default class EventScope<T = any> {

    public static create<T1 = any>() {
        return new EventScope<T1>(`eventScopeE${key}${id++}`)
    }

    public bindEvent(fx: (x: CustomEvent<T>) => any) {
        return {
            [this.eventName]: fx
        };
    }

    /**
     * This eventName contains `event-` prefix, use
     * eventType or toString for direct event binding.
     */
    public readonly eventName: string;

    private constructor(public readonly eventType: string) {
        this.eventName = `event-${this.eventType}`;
    }

    public subscribe(control: AtomControl, handler: (ce: CustomEvent<T>) => any)
    {
        return control.bindEvent(window as any, this.eventType, handler);
    }

    public listen(fx: (ce: CustomEvent<T>) => any) {
        const asyncHandler = (ce: CustomEvent<T>) => {
            if (ce.defaultPrevented) {
                return;
            }
            try {
                const p = fx(ce);
                if (p?.catch) {
                    p.catch((r) => {
                        if(CancelToken.isCancelled(r)) {
                            return;
                        }
                        console.error(r);
                    });
                }
            } catch (e) {
                if (CancelToken.isCancelled(e)) {
                    return;
                }
                console.error(e);
            }
        };
        window.addEventListener(this.eventType, asyncHandler);
        return {
            dispose:() => {
                window.removeEventListener(this.eventType, asyncHandler);
            }
        };
    }

    public listenOn(target: EventTarget, fx: (ce: CustomEvent<T>) => any) {
        const asyncHandler = (ce: CustomEvent<T>) => {
            if (ce.defaultPrevented) {
                return;
            }
            try {
                const p = fx(ce);
                if (p?.catch) {
                    p.catch((r) => {
                        if(CancelToken.isCancelled(r)) {
                            return;
                        }
                        console.error(r);
                    });
                }
            } catch (e) {
                if (CancelToken.isCancelled(e)) {
                    return;
                }
                console.error(e);
            }
        };
        target.addEventListener(this.eventType, asyncHandler);
        return {
            dispose:() => {
                target.removeEventListener(this.eventType, asyncHandler);
            }
        };
    }

    public dispatch(target: EventTarget, detail: T, {
        cancelable = true,
        bubbles = true
    } : { cancelable?: boolean, bubbles?: boolean } = {}) {
        const ce = new CustomEvent(this.eventType, { detail, cancelable, bubbles });
        target.dispatchEvent(ce);
        return ce;
    }

    public dispatchEvent(detail: T, cancelable: boolean = true) {
        const ce = new CustomEvent(this.eventType, { detail, cancelable, bubbles: false });
        window.dispatchEvent(ce);
        return ce;
    }

    public toString() {
        return this.eventType;
    }

}
