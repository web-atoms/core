import { App } from "../../App";
import { INameValuePairs, INotifyPropertyChanging } from "../../core/types";
import { AtomStyle } from "./AtomStyle";

export class AtomStyleSheet extends AtomStyle
        implements INotifyPropertyChanging {
    public styleElement: HTMLElement;
    private lastUpdateId: any = 0;

    private isAttaching: boolean = false;

    [key: string]: any;

    constructor(public readonly app: App, prefix: string) {
        super(null, null, prefix);
        this.styleSheet = this;
        this.pushUpdate();
    }

    public onPropertyChanging(name: string, newValue: any, oldValue: any): void {
        this.pushUpdate();
    }

    public pushUpdate(): void {
        if (this.isAttaching) {
            return;
        }
        if (this.lastUpdateId) {
            clearTimeout(this.lastUpdateId);
        }
        this.lastUpdateId = setTimeout(() => {
            this.attach();
        }, 1);
    }

    public dispose(): void {
        if (this.styleElement) {
            this.styleElement.remove();
        }
    }

    public attach(): void {
        this.isAttaching = true;
        const pairs = this.toStyle({});

        const textContent = this.flatten(pairs);
        if (this.styleElement) {
            if (this.styleElement.textContent === textContent) {
                this.isAttaching = false;
                return;
            }
        }
        const ss = document.createElement("style");

        ss.textContent = textContent;
        if (this.styleElement) {
            this.styleElement.remove();
        }
        document.head.appendChild(ss);
        this.styleElement = ss;
        this.isAttaching = false;
    }

    private flatten(pairs: INameValuePairs): string {
        const sl: string[] = [];
        for (const key in pairs) {
            if (pairs.hasOwnProperty(key)) {
                const element = pairs[key];
                sl.push(`.${key} ${element} `);
            }
        }

        return sl.join("\r\n");
    }

}
