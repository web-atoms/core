export default class JsonError extends Error {

    constructor(
        message: string,
        public readonly json: any) {
        super(message);
    }

    public get errors(): Array<{name: string, reason: string}> {
        return this.json.paramErrors ?? [];
    }

    public get details() {
        const { errors } = this;
        if (errors.length) {
            return errors.map((x) => `${x.name}: ${x.reason}`).join("\n");
        }
        return this.json?.details;
    }
}
