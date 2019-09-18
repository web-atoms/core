import { App } from "../App";
import MarkdownService from "../web/services/MarkdownService";
import FormattedString from "./FormattedString";

export default class Markdown extends FormattedString {

    public static from(text: string): Markdown {
        return new Markdown(text);
    }

    private constructor(public readonly text: string) {
        super();
    }

    public applyTo(app: App, element: any): void {
        const ms = app.resolve(MarkdownService) as MarkdownService;
        const t = ms.toHtml(this.text);
        (element as HTMLElement).innerHTML = t;
    }

    public toString(): string {
        return this.text;
    }

}
