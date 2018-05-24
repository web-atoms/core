import { NameValuePairs, NameValues } from "./types";
import { AtomControl } from "../controls/atom-control";

export class AtomUI {


    static createDelegate(arg0: any, arg1: any): any {
        throw new Error("Method not implemented.");
    }
    static attr(arg0: any, arg1: any): any {
        throw new Error("Method not implemented.");
    }
    static atomParent(element: HTMLElement):AtomControl {
        var eany:NameValuePairs = element as NameValuePairs;
        if (eany.atomControl) {
            return eany.atomControl;
        }
        if (!element.parentNode) {
            return null;
        }
        return AtomUI.atomParent(eany._logicalParent || element.parentNode);
    }

    /**
     * Don't use
     * @static
     * @param {HTMLElement} e
     * @returns {HTMLElement}
     * @memberof AtomUI
     */
    static cloneNode(e:HTMLElement):HTMLElement {
        return e.cloneNode(true) as HTMLElement;
    }

    static parseValue(val: string): (number|boolean|string) {
        if (/^[0-9]+$/.test(val)) {
            var n:number;
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
            // eturn val;
            return true;
        }
        if (/false/.test(val)) {
            // val = false;
            // return val;
            return false;
        }
        return val;
    }

    static parseUrl(url: string): NameValues {
        var r:NameValues = {};

        var plist:string[] = url.split("&");

        for(const item of plist) {
            const p:string[] = item.split("=");
            var key:string = p[0];
            var val:string = p[1];
            if (val) {
                val = decodeURIComponent(val);
            }
            // val = AtomUI.parseValue(val);
            r[key] = AtomUI.parseValue(val);
        }
        return r;
    }


    static *childEnumerator (e:HTMLElement): Iterable<HTMLElement> {
        var en:Element = e.firstElementChild;
        while(en) {
            if(en as HTMLElement) {
                yield en as HTMLElement;
            }
            en = en.nextElementSibling;
        }
    }

    static findPresenter(e:HTMLElement):HTMLElement {
        for(const item of AtomUI.childEnumerator(e)) {
            var ap:any = AtomUI.attr(item,"atom-presenter");
            if (ap) {
                return item;
            }
            var c:HTMLElement = AtomUI.findPresenter(item);
            if (c) {
                return c;
            }
        }
        return null;
    }
}