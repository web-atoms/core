import * as WebAtoms from "./core/types";

export class Atom {

    static encodeParameters(p: WebAtoms.INameValuePairs): string {
        if (!p) {
            return "";
        }
        let s: string = "";
        for (const key in p) {
            if (p.hasOwnProperty(key)) {
                const element: any = p[key];
                s += `&${key}=${encodeURIComponent(element)}`;
            }
        }
        return s;
    }

    static url(url: string, query?: WebAtoms.INameValuePairs, hash?: WebAtoms.INameValuePairs): string {
        if (!url) {
            return url;
        }
        let p: string = this.encodeParameters(query);
        if (p) {
            if (url.indexOf("?") === -1) {
                url += "?";
            }
            url += p;
        }
        p = this.encodeParameters(hash);
        if (p) {
            if (url.indexOf("#") === -1) {
                url += "#";
            }
            url += p;
        }
        return url;
    }

    static watch(): WebAtoms.AtomDisposable {
        return new WebAtoms.AtomDisposable(() => {
            // console.log("Disposed");
            window.console.log("Disposed");
        });
    }

}
