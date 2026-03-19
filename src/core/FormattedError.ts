import FormattedString from "./FormattedString.js";

export default class FormattedError implements Error {
    public name: string;
    public message: string;
    public stack?: string;

    public readonly formattedMessage: FormattedString;

    constructor(msg: FormattedString) {
        const e = new Error(msg.toString());
        (e as any).formattedMessage = msg;
        (e as any).__proto__ = FormattedError.prototype;
        return (e as any);
    }

}
