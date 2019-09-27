import FormattedError from "./FormattedError";
import Markdown from "./Markdown";

export default class MarkdownError extends FormattedError {
    constructor(text: string) {
        const a = super(Markdown.from(text)) as any;
        a.__proto__ = MarkdownError.prototype;
        return a;
    }
}
