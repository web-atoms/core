import { bindableProperty } from "./core/bindable-properties";
import { IDisposable, INameValuePairs, INotifyPropertyChanged, INotifyPropertyChanging } from "./core/types";
import { RegisterSingleton } from "./di/RegisterSingleton";

@RegisterSingleton
export class AtomTheme
    implements
        INotifyPropertyChanging,
        IDisposable {

    @bindableProperty
    public button: ButtonStyle<AtomTheme>;

    @bindableProperty
    public window: WindowStyle<AtomTheme>;

    private styleElement: HTMLElement;
    private lastUpdateId: number = 0;

    constructor() {
        this.window = new WindowStyle(this);
        this.button = new ButtonStyle(this);

        this.pushUpdate();
    }

    public onPropertyChanging(name: string, newValue: any, oldValue: any): void {
        const ov = oldValue as IElementStyle;
        if (ov.theme) {
            ov.theme = null;
        }
        const value = newValue;
        const ve = value as IElementStyle;
        if (ve.id && ve.createStyle) {
            ve.theme = this;
        }

        this.pushUpdate();
    }

    public pushUpdate(): void {
        if (this.lastUpdateId) {
            clearTimeout(this.lastUpdateId);
        }
        this.lastUpdateId = setTimeout(() => {
            this.remove();
            this.create();
        }, 100);
    }

    public dispose(): void {
        this.remove();
    }

    public remove(): void {
        this.styleElement.remove();
    }

    public create(): void {
        const ss = document.createElement("style");

        const sslist: string[] = [];

        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const element = this[key] as any;
                const es = element as IElementStyle;
                if (es.id && es.createStyle) {
                    sslist.push(es.createStyle());
                }
            }
        }

        ss.textContent = sslist.join("\r\n");
        document.head.appendChild(ss);
    }
}

export interface IElementStyle {
    id: string;
    theme: AtomTheme;
    createStyle(): string;
}

export class ElementStyle<T extends AtomTheme>
    implements INotifyPropertyChanged {

    public static lastId: number = 1010101;

    public id: string;

    private mCached: string;

    constructor(public theme: T) {
        this.id = `atom_component_class_${ElementStyle.lastId++}`;
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
        this.mCached = null;
        if (this.theme) {
            this.theme.pushUpdate();
        }
    }

    public toString(): string {
        return this.id;
    }
}

export class ButtonStyle<T extends AtomTheme> extends ElementStyle<T> {

}

export class WindowStyle<T extends AtomTheme> extends ElementStyle<T> {

    @bindableProperty
    public frame: ElementStyle<T> = new ElementStyle<T>(this.theme);

    @bindableProperty
    public frameBackground: INameValuePairs = {};

    @bindableProperty
    public content: INameValuePairs;

    @bindableProperty
    public titleHost: INameValuePairs;

    @bindableProperty
    public closeButton: INameValuePairs;

    @bindableProperty
    public title: INameValuePairs;

    @bindableProperty
    public commandBar: INameValuePairs;

}
