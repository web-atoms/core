/**
 * Defers execution for given milliseconds. And previous pending
 * execution is cancelled, so only the last execution will be executed.
 *
 * This is important when you want to watch multiple events and avoid multiple refresh
 * @param n number of milliseconds to defer
 */
export default function Defer(n: number = 100) {

    return (target: any, key: string, descriptor: any) => {
        // tslint:disable-next-line: ban-types
        const old = descriptor.value as Function;
        const k = Symbol.for(`defer_${key}`);
        descriptor.value = function(... a: any[]) {
            const id = this[k];
            if (id) {
                clearTimeout(id);
            }
            this[k] = setTimeout(() => {
                this[k] = undefined;
                old.apply(this, a);
            }, n);
        };
    };

}
