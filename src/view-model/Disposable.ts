import { AtomViewModel } from "./AtomViewModel";

const Disposable = (target: AtomViewModel, key: string) => {
    // property value
    const iVal: any = target[key];

    const keyName: string = "_" + key;
    const disposableKey: string = "_$_disposable" + key;

    target[keyName] = iVal;
    if (iVal) {
        target[disposableKey] = target.registerDisposable(iVal);
    }

    // property getter
    const getter: () => any = function(): any {
        return this[keyName];
    };

    // property setter
    const setter: (v: any) => void = function(newVal: any): void {
        const oldValue = this[keyName];
        // tslint:disable-next-line:triple-equals
        if (oldValue == newVal) {
            return;
        }

        const oldDisposable = this[disposableKey];
        if (oldDisposable && oldDisposable.dispose) {
            oldDisposable.dispose();
        }

        this[keyName] = newVal;
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
};

export default Disposable;
