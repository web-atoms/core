import { INameValues, IRect } from "../../core/types";

export class ChildEnumerator {

    private item: HTMLElement;

    public get current(): HTMLElement {
        return this.item;
    }

    constructor(private e: HTMLElement) {
    }

    public next(): boolean {
        if (!this.item) {
            this.item = this.e.firstElementChild as HTMLElement;
        } else {
            this.item = this.item.nextElementSibling as HTMLElement;
        }
        return this.item ? true : false;
    }

}

export class AtomUI {

    public static addClass(e: HTMLElement, names: string): void {
        throw new Error("Method not implemented.");
    }

    public static css(e: HTMLElement, names: {[key: string]: any}): void {
        throw new Error("Method not implemented.");
    }

    public static outerHeight(arg0: any, arg1: boolean = false): any {
        throw new Error("Method not implemented.");
    }

    public static outerWidth(arg0: any, arg1: boolean = false): any {
        throw new Error("Method not implemented.");
    }

    public static innerWidth(arg0: any): any {
        throw new Error("Method not implemented.");
    }

    public static innerHeight(arg0: any): any {
        throw new Error("Method not implemented.");
    }

    public static scrollTop(arg0: any, arg1: any): any {
        throw new Error("Method not implemented.");
    }

    public static screenOffset(e: HTMLElement): IRect {
        const r = {
            x: e.offsetLeft,
            y: e.offsetTop,
            width: e.offsetWidth,
            height: e.offsetHeight
        };

        if (e.offsetParent) {
            const p =  this.screenOffset(e.offsetParent as HTMLElement);
            r.x += p.x;
            r.y += p.y;
        }

        return r;
    }

    public static parseUrl(url: string): INameValues {
        const r: INameValues = {};

        const plist: string[] = url.split("&");

        for (const item of plist) {
            const p: string[] = item.split("=");
            const key: string = decodeURIComponent(p[0]);
            if (!key) {
                continue;
            }
            let val: string = p[1];
            if (val) {
                val = decodeURIComponent(val);
            }
            // val = AtomUI.parseValue(val);
            r[key] = this.parseValue(val);
        }
        return r;
    }

    public static parseValue(val: string): (number|boolean|string) {
        let n: number;
        if (/^[0-9]+$/.test(val)) {
            n = parseInt(val, 10);
            if (!isNaN(n)) {
                return n;
            }
            return val;
        }
        if (/^[0-9]+\.[0-9]+/gi.test(val)) {
            n = parseFloat(val);
            if (!isNaN(n)) {
                return n;
            }
            return val;
        }

        if (val === "true") {
            return true;
        }
        if (val === "false") {
            return false;
        }
        return val;
    }

    public static assignID(element: HTMLElement): string {
        if (!element.id) {
            element.id = "__waID" + AtomUI.getNewIndex();
        }
        return element.id;
    }

    public static toNumber(text: string): number {
        if (!text) {
            return 0;
        }
        if (text.constructor === String) {
            return parseFloat(text);
        }
        return 0;
    }

    public static getNewIndex(): number {
        AtomUI.index = AtomUI.index + 1;
        return AtomUI.index;
    }

    private static index: number = 1001;
}
