export class StringHelper {

    public static escapeRegExp(text: string) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    public static createContainsRegExp(text) {
        return new RegExp(this.escapeRegExp(text), "ig");
    }

    public static createContainsAnyWordRegExp(text: string) {
        return new RegExp(text.split(/\s+/g).map((x) => `(${this.escapeRegExp(x)})`).join("|"), "ig");
    }

    public static containsIgnoreCase(source: string, test: string) {
        if (!source) {
            return false;
        }
        if (!test) {
            return true;
        }
        return this.createContainsRegExp(test).test(source);
    }

    public static containsAnyWordIgnoreCase(source: string, test: string) {
        if (!source) {
            return false;
        }
        if (!test) {
            return true;
        }
        return this.createContainsAnyWordRegExp(test).test(source);
    }

    public static fromCamelToHyphen(input: string): string {
        return input.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase();
    }

    public static fromCamelToUnderscore(input: string): string {
        return input.replace( /([a-z])([A-Z])/g, "$1_$2" ).toLowerCase();
    }

    public static fromCamelToPascal(input: string): string {
        return input[0].toUpperCase() + input.substr(1);
    }

    public static fromHyphenToCamel(input: string): string {
        return input.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }

    public static fromUnderscoreToCamel(input: string): string {
        return input.replace(/\_([a-z])/g, (g) => g[1].toUpperCase());
    }

    public static fromPascalToCamel(input: string): string {
        return input[0].toLowerCase() + input.substr(1);
    }

}
