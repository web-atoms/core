import FormattedString from "../core/FormattedString";
import { NavigationService } from "../services/NavigationService";
import { AtomViewModel } from "./AtomViewModel";
import { registerInit } from "./baseTypes";

export interface IReportOptions {

    /**
     * Display success message after method successfully executes,
     * if method returns promise, success will display after promise
     * has finished, pass null to not display message
     */
    success?: string | FormattedString;

    /**
     * Title for success message
     */
    successTitle?: string;

    /**
     * Ask for confirmation before invoking this method
     */
    confirm?: string;
}

/**
 *
 * @param reportOptions
 */
export default function Report(
    {
        success = "Operation completed successfully",
        successTitle = "Done",
        confirm = null
    }: IReportOptions = {}) {
    // tslint:disable-next-line: only-arrow-functions
    return function(target: AtomViewModel, key: string | symbol): void {
        registerInit(target, (vm) => {
            // tslint:disable-next-line: ban-types
            const oldMethod = vm[key] as Function;
            vm[key] = async function() {
                const ns = vm.app.resolve(NavigationService) as NavigationService;
                try {

                    if (confirm) {
                        if (! await ns.confirm(confirm)) {
                            return;
                        }
                    }

                    const pe = oldMethod.call(this);
                    if (pe && pe.then) {
                        const result = await pe;
                        if (success) {
                            await ns.alert(success, successTitle);
                        }
                        return result;
                    }
                } catch (e) {
                    const s = "" + e;
                    if (/^(cancelled|canceled)$/i.test(s.trim())) {
                        return;
                    }
                    await ns.alert(s, "Error");
                }
            };
        });
    };
}
