import { StringHelper } from "./StringHelper";

export type ISubstitution = string | { variable: string };

export type IVariable = { variable: string, convert: (v: string) => any;};

export class Variable {

    public convert: (v: string) => any;

    public readonly catchAll: boolean;

    public readonly optional: boolean;

    public get regex() {
        if (this.catchAll) {
            return `(/(?<${this.variable}>.+)?)?`;
        }
        if (this.optional) {
            return `(/(?<${this.variable}>[^\\/]+))?`;
        }
        return `/(?<${this.variable}>[^\\/]+)`;
    }

    constructor(public readonly variable: string, public readonly name?: string) {
        this.convert = (v) => v;
        if (variable.startsWith("*")) {
            this.catchAll = true;
            variable = variable.substring(1);
        }
        if (variable.endsWith("?")) {
            this.optional = true;
            variable = variable.substring(0, variable.length - 1);
        }

        const index = variable.indexOf(":");
        if (index !== -1) {
            const parseAs = variable.substring(index + 1);
            variable = variable.substring(0, index);

            switch(parseAs) {
                case "number":
                    this.convert = (v) => {
                        const r = parseFloat(v);
                        if (Number.isNaN(r)) {
                            return void 0;
                        }
                        return r;
                    };
                    break;
                case "boolean":
                    this.convert = (v) => {
                        if(v === "true") {
                            return true;
                        }
                        if (v === "false") {
                            return false;
                        }
                    };
                    break;
            }
        }
        this.variable = variable;
        this.name ??= variable;
    }
}

export default class Route {

    /**
     * Useful when we want to test urls locally, we can prefix url with `#!` etc
     * @param url url to encode
     * @returns string
     */
    public static encodeUrl(url: string) {
        return url;
    }

    public static create<T>(route: string, queries?: string[], order: number = 0) {
        if (!route.startsWith("/")) {
            throw new Error("String Route must start with /");
        }
        return new Route(route, queries, order);
    }

    public readonly regex: RegExp;

    public readonly queries = new Map<string, string>();

    public readonly variables: Variable[] = [];

    private substitutions: ISubstitution[] = [];

    private constructor(
        public readonly route: string,
        queries: string[],
        public readonly order : number = 0) {


        if (queries) {
            for (const iterator of queries) {
                let [name, variable = name] = iterator.split("=");
                if (variable.startsWith("{")) {
                    variable = variable.substring(1, variable.length - 1);
                }
                this.queries.set(name, variable);
            }
        }

        
        const tokens = route.substring(1).split(/\//g);
        let regex = "^";
        this.substitutions.push("/");

        let catchAll = false;

        for (const iterator of tokens) {
            if (regex.length > 2) {
                this.substitutions.push("/");
            }
            if (!iterator.startsWith("{")) {
                this.substitutions.push(iterator);
                regex += StringHelper.escapeRegExp("/");
                regex += StringHelper.escapeRegExp(iterator);
                continue;
            }

            if (!iterator.endsWith("}")) {
                throw new Error("invalid route, missing end curly brace");
            }

            const v = new Variable(iterator.substring(1, iterator.length - 1));

            regex += v.regex;

            this.variables.push(v);
            this.substitutions.push(v);

            catchAll ||= v.catchAll;

        }

        if(!catchAll) {
            regex += "$";
        }

        this.regex = new RegExp(regex, "i");
    }

    public matches(route: string, q?: URLSearchParams): any | null {
        const matches = this.regex.exec(route);
        if (matches?.length > 0) {
            const result = {};
            const { groups } = matches as any;
            for (const iterator of this.variables) {
                const v = groups[iterator.variable];
                if (v !== void 0 && v !== null) {
                    const converted = iterator.convert( decodeURIComponent(v));
                    if (converted === void 0) {
                        return null;
                    }
                    result[iterator.variable] = converted;
                }
            }
            if (q) {
                for (let [key, value] of (q as any).entries()) {
                    const variable = this.queries.get(key) ?? key;
                    result[variable] = value;
                }
            }
            return result;
        }
        return null;
    }

    public substitute(vars: any) {
        let result = "";
        for (const iterator of this.substitutions) {
            if (typeof iterator === "string") {
                result += iterator;
                continue;
            }
            result += vars[iterator.variable] ?? "";
        }
        if (this.queries.size > 0) {
            result += "?";
            for (const [key, variable] of this.queries.entries()) {
                const value = vars[variable];
                if (value) {
                    result += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`
                }
            }
        }
        return result;
    }

}
