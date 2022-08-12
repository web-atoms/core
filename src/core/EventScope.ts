import DateTime from "@web-atoms/date-time/dist/DateTime";

const key = DateTime.now.msSinceEpoch;
let id = 1;

export default class EventScope {

    public static create() {
        return new EventScope(`eventScopeE${key}${id++}`)
    }

    private constructor(private id: string) {

    }

    public listen(fx: (ce: Event) => void) {
        document.body.addEventListener(this.id, fx);
        return {
            dispose() {
                document.body.removeEventListener(this.id, fx);
            }
        };
    }

    public dispatchEvent<T>(detail: T, cancelable: boolean = false) {
        const ce = new CustomEvent(this.id, { detail, cancelable });
        document.body.dispatchEvent(ce);
        return ce;
    }

}
