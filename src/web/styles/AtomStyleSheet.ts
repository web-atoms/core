import { App } from "../../App";
import { IClassOf, INameValuePairs, INotifyPropertyChanging } from "../../core/types";
import { TypeKey } from "../../di/TypeKey";
import { AtomStyle } from "./AtomStyle";

export class AtomStyleSheet implements INotifyPropertyChanging {

    public styleElement: any;

    public styles: {[key: string]: AtomStyle} = {};

    private lastUpdateId: any = 0;

    private isAttaching: boolean = false;

    constructor(public readonly app: App, public readonly name: string) {
        this.pushUpdate(0);
    }

    public getNamedStyle<T extends AtomStyle>(c: IClassOf<T>): AtomStyle {
        const name = TypeKey.get(c);
        return this.createNamedStyle(c, name);
    }

    public createNamedStyle<T extends AtomStyle>(c: IClassOf<T>, name: string, updateTimeout?: number): T {
        const style = this.styles[name] = new (c)(this, `${this.name}-${name}`);
        style.build();
        this.pushUpdate(updateTimeout);
        return style;
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
        const text = [];
        for (const key in this.styles) {
            if (this.styles.hasOwnProperty(key)) {
                const element = this.styles[key];
                text.push(element.toString());
            }
        }
        const textContent = text.join("\n");
        this.app.updateDefaultStyle(textContent);
        this.isAttaching = false;
    }

}
