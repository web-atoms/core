import { AtomBinder } from "./atom-binder";

export function bindableProperty(target: any, key: string): any {
    // property value
    const iVal: any = target[key];

    const keyName: string = "_" + key;

    target[keyName] = iVal;

    // property getter
    const getter: () => any = function(): any {
        // console.log(`Get: ${key} => ${_val}`);
        return this[keyName];
    };

    // property setter
    const setter: (v: any) => void = function(newVal: any): void {
        // console.log(`Set: ${key} => ${newVal}`);
        // debugger;
        const oldValue = this[keyName];
        // tslint:disable-next-line:triple-equals
        if (oldValue == newVal) {
            return;
        }
        this[keyName] = newVal;

        AtomBinder.refreshValue(this, key);

        if (this.onPropertyChanged) {
            this.onPropertyChanged(key);
        }
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
