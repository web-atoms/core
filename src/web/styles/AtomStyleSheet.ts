import { App } from "../../App";
import { INameValuePairs, INotifyPropertyChanging } from "../../core/types";
import { AtomStyle } from "./AtomStyle";

export class AtomStyleSheet extends AtomStyle
        implements INotifyPropertyChanging {
    private lastUpdateId: any = 0;

    private isAttaching: boolean = false;

    [key: string]: any;

    constructor(public readonly app: App, prefix: string) {
        super(null, null, prefix);
        this.styleSheet = this;
        this.pushUpdate(0);
    }

    public onPropertyChanging(name: string, newValue: any, oldValue: any): void {
        this.pushUpdate();
    }

    public pushUpdate(delay: number = 1): void {
        if (this.isAttaching) {
            return;
        }
        if (this.lastUpdateId) {
            clearTimeout(this.lastUpdateId);
        }
        this.lastUpdateId = setTimeout(() => {
            this.attach();
        }, delay);
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
        this.app.updateDefaultStyle(textContent);
        this.isAttaching = false;
    }

    protected build(): void {
        // do nothing..
    }

    private flatten(pairs: INameValuePairs): string {
        // const sl: Array<[string, string]> = [];
        const r = [];
        for (const key in pairs) {
            if (pairs.hasOwnProperty(key)) {
                const element = pairs[key];
                // sl.push([key,  element]);
                r.push(`.${key} ${element}`);
            }
        }

        // sl.sort((a, b) => a[0].localeCompare(b[0]) );

        // return sl.map((i) => `.${i[0]} ${i[1]}`).join("\r\n");
        return r.join("\n");
    }

}
