import { StringHelper } from "../core/StringHelper";
import { RegisterSingleton } from "../di/RegisterSingleton";

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

export type JsonKeysNamingStrategy = "underscore" | "hyphen" | "none";

@RegisterSingleton
export class JsonService {

    /**
     * When set to none, no key transform is performed
     */
    public namingStrategy: JsonKeysNamingStrategy = "none";

    public transformKeys(t: (ins: string) => string, v: any): any {
        if (!v) {
            return v;
        }
        if (typeof v !== "object") {
            return v;
        }
        if (typeof v === "object" && v.length !== undefined && typeof v.length === "number") {
            const a = v as any[];
            if (a.map) {
                return a.map( (x) => this.transformKeys(t, x));
            }
            const ra = [];
            for (const iterator of a) {
                ra.push(this.transformKeys(t, iterator));
            }
            return ra;
        }

        const r = {};
        for (const key in v) {
            if (v.hasOwnProperty(key)) {
                const element = v[key];
                r[ t(key) ] = this.transformKeys(t, element);
            }
        }
        return r;
    }

    public parse(text: string): any {
        const result = JSON.parse(text, (key, value) => {
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
        switch (this.namingStrategy) {
            case "hyphen":
                return this.transformKeys(StringHelper.fromHyphenToCamel, result);
            case "underscore":
                return this.transformKeys(StringHelper.fromUnderscoreToCamel, result);
        }
        return result;
    }

    public stringify(v: any): string {
        switch (this.namingStrategy) {
            case "hyphen":
                v = this.transformKeys(StringHelper.fromCamelToHyphen, v);
                break;
            case "underscore":
                v = this.transformKeys(StringHelper.fromCamelToUnderscore, v);
                break;
        }
        return JSON.stringify(v, (key, value) => {
            if (/^\_\$\_/.test(key)) {
                return undefined;
            }
            return value;
        }, 2);
    }
}
