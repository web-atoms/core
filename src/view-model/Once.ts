import { App } from "../App";
import { AtomViewModel } from "./AtomViewModel";
import { registerInit } from "./baseTypes";

const timerSymbol = Symbol();

const Once = (timeInMS: number = 100) =>
    (target: AtomViewModel, key: string | symbol): void => {
            registerInit(target, (vm) => {
                // tslint:disable-next-line: ban-types
                const oldMethod = vm[key] as Function;
                const keyTimer = vm[timerSymbol] ??= {};

                // tslint:disable-next-line:only-arrow-functions
                vm[key] = async ( ... a: any[]) => {
                    const pending = keyTimer[key];
                    if (pending) {
                        clearTimeout(pending);
                    }
                    keyTimer[key] = setTimeout((... b: any[]) => {
                        delete keyTimer[key];
                        const r = oldMethod.apply(vm, b);
                        if (r && r.then) {
                            r.then(() => {
                                // do nothing...
                            }, (e) => {
                                // tslint:disable-next-line: no-console
                                console.warn(e);
                            });
                        }
                    }, timeInMS, ... a);
                };

            });
    };

export default Once;
