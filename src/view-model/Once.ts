import { App } from "../App.js";
import { AtomViewModel } from "./AtomViewModel.js";
import { registerInit } from "./baseTypes.js";

const timerSymbol = Symbol();

const Once = (timeInMS: number = 100) =>
    (target: AtomViewModel, key: string | symbol): void => {
            registerInit(target, (vm) => {
                // tslint:disable-next-line: ban-types
                const oldMethod = vm[key] as Function;
                let keyTimer = vm[timerSymbol];
                if (typeof keyTimer === "undefined") {
                    keyTimer = {};
                    vm[timerSymbol] = keyTimer;
                }

                let running = false;

                // tslint:disable-next-line:only-arrow-functions
                vm[key] = ( ... a: any[]) => {
                    if (running) {
                        return;
                    }
                    const pending = keyTimer[key];
                    if (pending) {
                        clearTimeout(pending);
                    }
                    keyTimer[key] = setTimeout((... b: any[]) => {
                        running = true;
                        delete keyTimer[key];
                        const r = oldMethod.apply(vm, b);
                        if (r && r.then) {
                            r.then(() => {
                                running = false;
                            }, (e) => {
                                running = false;
                                // tslint:disable-next-line: no-console
                                console.warn(e);
                            });
                        } else {
                            running = false;
                        }
                    }, timeInMS, ... a);
                };

            });
    };

export default Once;
