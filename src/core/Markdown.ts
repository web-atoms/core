import { App } from "../App";
import MarkdownService from "../web/services/MarkdownService";
import FormattedString from "./FormattedString";

export default class Markdown extends FormattedString {

    public static from(text: string): Markdown {
        return new Markdown(text);
    }

    public applyTo(app: App, element: any): void {
        (element as HTMLElement).innerHTML = this.toHtmlString(app);
    }

    public toString(): string {
        return this.text;
    }

    public  toHtmlString(app?: App): string {
        const ms = app
            ? app.resolve(MarkdownService) as MarkdownService
            : MarkdownService.instance;
        return ms.toHtml(this.text);
    }

}
