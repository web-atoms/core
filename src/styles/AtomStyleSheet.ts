import { INameValuePairs, INotifyPropertyChanging } from "../core/types";
import { AtomStyle } from "./AtomStyle";
import { AtomStyleClass } from "./AtomStyleClass";

export class AtomStyleSheet extends AtomStyle
        implements INotifyPropertyChanging {
    private styleElement: HTMLElement;
    private lastUpdateId: number = 0;

    constructor(prefix: string) {
        super(null, null, prefix || "default_theme");
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
            this.attach(true);
        }, 100);
    }

    public dispose(): void {
        if (this.styleElement) {
            this.styleElement.remove();
        }
    }

    public attach(recreate?: boolean): void {
        if (this.styleElement) {
            if (!recreate) {
                return;
            }
        }
        const ss = document.createElement("style");

        const sslist: string[] = [];

        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const element = this[key] as any;
                const es = element as AtomStyleClass;
                if (es && es.createStyle) {
                    sslist.push(es.createStyle());
                }
            }
        }

        ss.textContent = sslist.join("\r\n");
        if (this.styleElement) {
            this.styleElement.remove();
        }
        document.head.appendChild(ss);
        this.styleElement = ss;
    }

}
