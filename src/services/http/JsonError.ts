export default class JsonError extends Error {

    constructor(
        message: string,
        public readonly json: any) {
        super(message);
    }

    public get errors(): Array<{name: string, reason: string}> {
        return this.json.paramErrors ?? [];
    }

    public get detail() {
        if (this.json.paramErrors) {
            return this.errors.map((x) => `${x.name}: ${x.reason}`).join("\n");
        }
        return this.json?.detail ?? this.message;
    }
}
