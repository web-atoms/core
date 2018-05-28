import { AtomControl } from "../controls/atom-control";
import { INameValuePairs, INameValues } from "./types";

export class AtomUI {

    public static parent(arg0: any): any {
        throw new Error("Method not implemented.");
    }
    
    public atomParent(element: HTMLElement): AtomControl {
        const eany: INameValuePairs = element as INameValuePairs;
        if (eany.atomControl) {
            return eany.atomControl;
        }
        if (!element.parentNode) {
            return null;
        }
        return this.atomParent(eany._logicalParent || element.parentNode);
    }

    /**
     * Don't use
     * @static
     * @param {HTMLElement} e
     * @returns {HTMLElement}
     * @memberof AtomUI
     */
    public cloneNode(e: HTMLElement): HTMLElement {
        return e.cloneNode(true) as HTMLElement;
    }

    public parseValue(val: string): (number|boolean|string) {
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

    public parseUrl(url: string): INameValues {
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

    public *childEnumerator(e: HTMLElement): Iterable<HTMLElement> {
        let en: Element = e.firstElementChild;
        while (en) {
            if (en as HTMLElement) {
                yield en as HTMLElement;
            }
            en = en.nextElementSibling;
        }
    }

    public findPresenter(e: HTMLElement): HTMLElement {
        for (const item of this.childEnumerator(e)) {
            const ap: any = this.attr(item, "atom-presenter");
            if (ap) {
                return item;
            }
            const c: HTMLElement = this.findPresenter(item);
            if (c) {
                return c;
            }
        }
        return null;
    }
    public attr(arg0: any, arg1: any): any {
        throw new Error("Method not implemented.");
    }
}
