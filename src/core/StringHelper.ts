export class StringHelper {

    public static fromCamelToHyphen(input: string): string {
        return input.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase();
    }

    public static fromCamelToUnderscore(input: string): string {
        return input.replace( /([a-z])([A-Z])/g, "$1_$2" ).toLowerCase();
    }

    public static fromHyphenToCamel(input: string): string {
        return input.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }

    public static fromUnderscoreToCamel(input: string): string {
        return input.replace(/\_([a-z])/g, (g) => g[1].toUpperCase());
    }
}
