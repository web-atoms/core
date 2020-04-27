import { App } from "../../App";
import { IClassOf, INameValuePairs, INotifyPropertyChanging } from "../../core/types";
import { TypeKey } from "../../di/TypeKey";
import { AtomStyle } from "./AtomStyle";

export class AtomStyleSheet extends AtomStyle
        implements INotifyPropertyChanging {
    private lastUpdateId: any = 0;

    private isAttaching: boolean = false;

    private defaults: { [key: string]: AtomStyle} = {};

    [key: string]: any;

    constructor(public readonly app: App, prefix: string) {
        super(null, prefix);
        (this as any).styleSheet = this;
        this.pushUpdate(0);
    }

    public getDefaultStyle(forKey: any): AtomStyle {
        return this.defaults[TypeKey.get(forKey)];
    }

    public createNamedStyle<T extends AtomStyle>(c: IClassOf<T>, name: string, updateTimeout?: number): T {
        const style = this[name] = new (c)(this.styleSheet, `${this.name}-${name}`);
        style.build();
        this.pushUpdate(updateTimeout);
        return style;
    }

    public createStyle<TC, T extends AtomStyle>(tc: IClassOf<TC>, c: IClassOf<T>, name: string): T {

        this.defaults = this.defaults || {};

        const newStyle = new (c)(this.styleSheet, `${this.name}-${name}`);
        const key = TypeKey.get(tc);
        this.defaults[key] = newStyle;
        newStyle.build();
        this.pushUpdate();
        return this[name] = newStyle;
    }

    public onPropertyChanging(name: string, newValue: any, oldValue: any): void {
        this.pushUpdate();
    }

    public pushUpdate(delay: number = 1): void {
        if (this.isAttaching) {
            return;
        }

        // special case for Xamarin Forms
        if (delay === 0) {
            this.attach();
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

    public build(): void {
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
