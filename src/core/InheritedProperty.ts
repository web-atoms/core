import { AtomBinder } from "./AtomBinder";
import { AtomBridge } from "./AtomBridge";
import { INotifyPropertyChanging } from "./types";

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
        const p = this[keyName];
        if (p !== undefined) {
            return p;
        }
        if (this.element && this.parent) {
            return this.parent[key];
        }
        return undefined;
    };

    // property setter
    const setter: (v: any) => void = function(newVal: any): void {
        const oldValue = this[keyName];

        if (oldValue && oldValue.dispose) {
            oldValue.dispose();
        }

        this[keyName] = newVal;

        AtomBridge.refreshInherited(this, key);
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
