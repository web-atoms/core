import { INameValuePairs, INotifyPropertyChanged } from "../core/types";
import { AtomViewModel } from "../view-model/AtomViewModel";
import { AtomStyle } from "./AtomStyle";
import { AtomStyleSheet } from "./AtomStyleSheet";

export class AtomStyleClass
    extends AtomViewModel
    implements INotifyPropertyChanged{

    private mCached: string;

    constructor(
        public readonly styleSheet: AtomStyleSheet,
        public readonly parent: AtomStyle,
        public readonly className: string,
        props?: INameValuePairs ) {
        super();
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                const element = props[key];
                this[key] = element;
            }
        }
    }

    public createStyle(): string {
        if (this.mCached) {
            return this.mCached;
        }

        const sslist: Array<{ name: string, content: string}> = [];
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const element = this[key] as any;
                if (element) {
                    const ec = this.toStyle(element);
                    sslist.push({
                        name: key,
                        content: ec
                    });
                }
            }
        }

        this.mCached = sslist.join("\r\n");

        return this.mCached;
    }

    public toStyle(e: string | {[key: string]: string}): string {
        if (typeof e === "string") {
            return e;
        }
        const pairs: string[] = [];
        for (const key in e) {
            if (e.hasOwnProperty(key)) {
                const element = e[key];
                pairs.push(`${key}: ${element};`);
            }
        }
        return `{
            ${pairs.join("\t\t\r\n")}
        }`;
    }

    public onPropertyChanged(name: string): void {
        this.styleSheet.pushUpdate();
    }
}
