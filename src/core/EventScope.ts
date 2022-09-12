import DateTime from "@web-atoms/date-time/dist/DateTime";
import { CancelToken } from "./types";

const key = DateTime.now.msSinceEpoch;
let id = 1;

export default class EventScope<T> {

    public static create<T1 = any>() {
        return new EventScope<T1>(`eventScopeE${key}${id++}`)
    }

    private constructor(public readonly eventType: string) {

    }

    public listen(fx: (ce: CustomEvent<T>) => any) {
        const asyncHandler = (ce: CustomEvent<T>) => {
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

    public dispatchEvent(detail: T, cancelable: boolean = false) {
        const ce = new CustomEvent(this.eventType, { detail, cancelable, bubbles: false });
        window.dispatchEvent(ce);
        return ce;
    }

}
