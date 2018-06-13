import { INameValuePairs, INotifyPropertyChanged } from "../core/types";
import { AtomViewModel } from "../view-model/AtomViewModel";
import { AtomStyle } from "./AtomStyle";
import { AtomStyleSheet } from "./AtomStyleSheet";

export class AtomStyleClass
    extends AtomViewModel
    implements INotifyPropertyChanged {

    private styles: INameValuePairs = {};

    private mCached: string;

    constructor(
        public readonly styleSheet: AtomStyleSheet,
        public readonly parent: AtomStyle,
        public readonly className: string,
        props?: INameValuePairs ) {
        super();
        if (props) {
            this.updateStyle(props);
        }
    }

    public updateStyle(props?: INameValuePairs): AtomStyleClass {
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                const element = props[key];
                this.styles[key] = element;
            }
        }
        return this;
    }

    public createStyle(): string {

        const sslist: any[] = [];
        for (const key in this.styles) {
            if (this.styles.hasOwnProperty(key)) {
                const element = this.styles[key];
                sslist.push(`${key}: ${element}`);
            }
        }

        this.mCached = ` { ${sslist.join(";\r\n")} } `;
        return this.mCached;
    }

    public onPropertyChanged(name: string): void {
        this.styleSheet.pushUpdate();
    }
}
