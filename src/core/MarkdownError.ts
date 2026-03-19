import FormattedError from "./FormattedError.js";
import Markdown from "./Markdown.js";

export default class MarkdownError extends FormattedError {
    constructor(text: string) {
        const a = super(Markdown.from(text)) as any;
        a.__proto__ = MarkdownError.prototype;
        return a;
    }
}
