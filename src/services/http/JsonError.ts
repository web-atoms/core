export default class JsonError extends Error {

    constructor(
        message: string,
        public readonly json: any) {
        super(message);
    }

    public get errors(): Array<{name: string, reason: string}> {
        return this.json.paramErrors ?? [];
    }
}
