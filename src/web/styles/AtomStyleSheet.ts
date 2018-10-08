import { INameValuePairs, INotifyPropertyChanging } from "../../core/types";
import { AtomStyle } from "./AtomStyle";
import { AtomStyleClass } from "./AtomStyleClass";

export class AtomStyleSheet extends AtomStyle
        implements INotifyPropertyChanging {
    public styleElement: HTMLElement;
    private lastUpdateId: number = 0;

    [key: string]: any;

    constructor(prefix: string) {
        super(null, null, prefix);
        this.styleSheet = this;
        this.pushUpdate();
    }

    public onPropertyChanging(name: string, newValue: any, oldValue: any): void {
        const ov = oldValue as AtomStyleClass;

        this.pushUpdate();
    }

    public pushUpdate(): void {
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
        const ss = document.createElement("style");

        const pairs = this.toStyle({});

        ss.textContent = this.flatten(pairs);

        if (this.styleElement) {
            this.styleElement.remove();
        }
        document.head.appendChild(ss);
        this.styleElement = ss;
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
