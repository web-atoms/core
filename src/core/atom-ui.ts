import { AtomControl } from "../controls/atom-control";
import { INameValuePairs, INameValues } from "./types";

export class AtomUI {

   public static getAtomType(arg0: any): any {
        throw new Error("Method not implemented.");
    }

    // moved to AtomBridge
    // public atomParent(element: HTMLElement): AtomControl {
    //     const eany: INameValuePairs = element as INameValuePairs;
    //     if (eany.atomControl) {
    //         return eany.atomControl;
    //     }
    //     if (!element.parentNode) {
    //         return null;
    //     }
    //     return this.atomParent(eany._logicalParent || element.parentNode);
    // }

    public static *childEnumerator(e: HTMLElement): Iterable<HTMLElement> {
        let en: Element = e.firstElementChild;
        while (en) {
            if (en as HTMLElement) {
                yield en as HTMLElement;
            }
            en = en.nextElementSibling;
        }
    }

    public static parseUrl(url: string): INameValues {
        const r: INameValues = {};

        const plist: string[] = url.split("&");

        for (const item of plist) {
            const p: string[] = item.split("=");
            const key: string = p[0];
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

        if (/true/.test(val)) {
            // val = true;
            // return val;
            return true;
        }
        if (/false/.test(val)) {
            // val = false;
            // return val;
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
        this.index = this.index + 1;
        return this.index;
    }
}
