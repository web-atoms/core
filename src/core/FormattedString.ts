import { App } from "../App";

export default abstract class FormattedString {

    public abstract applyTo(app: App, element: any);

    public abstract toHtmlString(app: App): string;

}
