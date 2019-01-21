import { IValueConverter } from "../core/IValueConverter";
import { StringHelper } from "../core/StringHelper";
import { RegisterSingleton } from "../di/RegisterSingleton";

export const dateFormatISORegEx = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
export const dateFormatMSRegEx = /^\/Date\((d|-|.*)\)[\/|\\]$/;

export type JsonKeysNamingStrategy = "underscore" | "hyphen" | "none";

export interface IJsonParserOptions {
    namingStrategy?: JsonKeysNamingStrategy;
    dateConverter?: Array<{
        regex?: RegExp;
        valueCovnerter: IValueConverter;
    }>;
    indent?: number;
}

@RegisterSingleton
export class JsonService {

    public options: IJsonParserOptions = {
        indent: 2,
        namingStrategy: "none",
        dateConverter: [
            {
                regex: dateFormatISORegEx,
                valueCovnerter: {
                    fromSource(v: string): Date {
                        return new Date(v);
                    },
                    fromTarget(v: Date): any {
                        return v.toISOString();
                    }
                }
            }, {
                regex: dateFormatMSRegEx,
                valueCovnerter: {
                    fromSource(v: string): Date {
                        const a = dateFormatMSRegEx.exec(v);
                        const b = a[1].split(/[-+,.]/);
                        return new Date(b[0] ? +b[0] : 0 - +b[1]);
                    },
                    fromTarget(v: Date): any {
                        return v.toISOString();
                    }
                }
            }
        ]
    };

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

    public parse(text: string, options?: IJsonParserOptions): any {

        const { dateConverter, namingStrategy } = {
            ... this.options,
            ... options
        };

        const result = JSON.parse(text, (key, value) => {
            // trannsform date...
            if (typeof value === "string") {
                for (const iterator of dateConverter) {
                    const a = iterator.regex.exec(value);
                    if (a) {
                        return iterator.valueCovnerter.fromSource(value);
                    }
                }
            }
            return value;
        } );
        switch (namingStrategy) {
            case "hyphen":
                return this.transformKeys(StringHelper.fromHyphenToCamel, result);
            case "underscore":
                return this.transformKeys(StringHelper.fromUnderscoreToCamel, result);
        }
        return result;
    }

    public stringify(v: any, options?: IJsonParserOptions): string {
        const { namingStrategy, dateConverter, indent } = {
            ... this.options,
            ... options
        };
        switch (namingStrategy) {
            case "hyphen":
                v = this.transformKeys(StringHelper.fromCamelToHyphen, v);
                break;
            case "underscore":
                v = this.transformKeys(StringHelper.fromCamelToUnderscore, v);
                break;
        }
        return JSON.stringify(v, (key, value) => {
            if (key && /^\_\$\_/.test(key)) {
                return undefined;
            }
            if (dateConverter && (value instanceof Date)) {
                return dateConverter[0].valueCovnerter.fromTarget(value);
            }
            return value;
        }, indent);
    }
}
