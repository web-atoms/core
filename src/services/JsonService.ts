import { RegisterSingleton } from "../di/RegisterSingleton";

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

@RegisterSingleton
export class JsonService {

    public parse(text: string): any {
        return JSON.parse(text, (key, value) => {
            // trannsform date...
            if (typeof value === "string") {
                let a = reISO.exec(value);
                if (a) {
                    return new Date(value);
                }
                a = reMsAjax.exec(value);
                if (a) {
                    const b = a[1].split(/[-+,.]/);
                    return new Date(b[0] ? +b[0] : 0 - +b[1]);
                }
            }
            return value;
        } );
    }

    public stringify(v: any): string {
        return JSON.stringify(v, (key, value) => {
            if (/^\_\$\_/.test(key)) {
                return undefined;
            }
            return value;
        }, 2);
    }
}
