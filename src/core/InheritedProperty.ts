import type { AtomControl } from "../web/controls/AtomControl";
import { AtomBinder } from "./AtomBinder";

function refreshInherited(ac: AtomControl, key: any, storageKey: any) {
    AtomBinder.refreshValue(ac, key);
    const e = ac.element;
    let start = e.firstElementChild as HTMLElement;
    if (!start) {
        return;
    }
    const stack = [start];
    while(stack.length) {
        start = stack.pop();
        while (start) {
            let firstChild = start.firstElementChild as HTMLElement;
            const ac = start.atomControl;
            if (ac) {
                if (ac[storageKey] === undefined) {
                    AtomBinder.refreshValue(ac, key);
                } else {
                    // we will not refresh this element
                    firstChild = void 0;
                }
            }
            if (firstChild) {
                stack.push(firstChild);
            }
            start = start.nextElementSibling as HTMLElement;
        }
    }
};

/**
 * Use this decorator only to watch property changes in `onPropertyChanged` method.
 * This decorator also makes enumerable property.
 *
 * Do not use this on anything except UI control
 * @param target control
 * @param key name of property
 */
export function InheritedProperty(target: any, key: string): any {
    // property value
    const iVal: any = target[key];

    const keyName = typeof Symbol === "undefined"
        ? ("_" + key)
        : Symbol(`${key}`);

    target[keyName] = iVal;

    // property getter
    const getter: () => any = function(): any {
        let start = this;
        do {
            const p = start[keyName];
            if (typeof p !== "undefined") {
                return p;
            }
            if (!start.element) {
                break;
            }
            start = start.parent;
        } while (start);
        return undefined;
    };

    // property setter
    const setter: (v: any) => void = function(newVal: any): void {
        const oldValue = this[keyName];

        if (oldValue && oldValue.dispose) {
            oldValue.dispose();
        }

        this[keyName] = newVal;

        refreshInherited(this, key, keyName);
    };

    // delete property
    if (delete target[key]) {

        // create new property with getter and setter
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });

    }
}
