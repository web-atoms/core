export class StringHelper {
    public static fromCamelToHyphen(input: string): string {
        return input.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase();
    }
}
