import { INameValuePairs, INotifyPropertyChanged } from "../core/types";
import { AtomViewModel } from "../view-model/AtomViewModel";
import { AtomStyle, IAtomStyle } from "./AtomStyle";
import { AtomStyleSheet } from "./AtomStyleSheet";

export class AtomStyleClass
    implements INotifyPropertyChanged,
    IAtomStyle {

    private styles: INameValuePairs = {};

    private mCached: string;

    public get name(): string {
        return this.className;
    }

    constructor(
        public readonly styleSheet: AtomStyleSheet,
        public readonly parent: AtomStyle,
        public readonly className: string,
        props?: INameValuePairs ) {
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
