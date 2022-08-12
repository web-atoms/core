import DateTime from "@web-atoms/date-time/dist/DateTime";
import { StringHelper } from "./StringHelper";

const key = DateTime.now.msSinceEpoch;
let id = 1;

export default class EventScope {

    public static create() {
        return new EventScope(`eventScopeE${key}${id++}`)
    }

    private constructor(private id: string) {

    }

    public listen(eventName: string, fx: (ce: Event) => void) {
        eventName = this.id + "E" + StringHelper.fromHyphenToCamel(eventName);
        document.body.addEventListener(eventName, fx);
        return {
            dispose() {
                document.body.removeEventListener(eventName, fx);
            }
        };
    }

    public dispatchEvent<T>(eventName, detail: T, cancelable: boolean = false) {
        eventName = this.id + "E" + StringHelper.fromHyphenToCamel(eventName);
        const ce = new CustomEvent(eventName, { detail, cancelable });
        document.body.dispatchEvent(ce);
        return ce;
    }

}
