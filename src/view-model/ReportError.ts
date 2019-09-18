import { NavigationService } from "../services/NavigationService";
import { AtomViewModel } from "./AtomViewModel";
import { registerInit } from "./baseTypes";

function report(app, e) {
    const ns = app.resolve(NavigationService) as NavigationService;
    return ns.alert(e, "Error").catch((ex) => {
        // tslint:disable-next-line: no-console
        console.error(ex);
    });
}

export default function ReportError(target: AtomViewModel, key: string | symbol): void {
    registerInit(target, (vm) => {
        // tslint:disable-next-line: ban-types
        const oldMethod = vm[key] as Function;
        vm[key] = function() {
            try {
                const pe = oldMethod.call(this);
                if (pe && pe.catch) {
                    pe.catch((ex) => {
                        report(vm.app, ex);
                    });
                    return pe;
                }
            } catch (e) {
                report(vm.app, e);
            }
        };
    });
}
