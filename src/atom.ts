import * as WebAtoms from "./core/types";

export class Atom {


    static encodeParameters(p:WebAtoms.NameValuePairs): string {
        if(!p) {
            return "";
        }
        var s:string = "";
        for (const key in p) {
            if (p.hasOwnProperty(key)) {
                const element:any = p[key];
                s += `&${key}=${encodeURIComponent(element)}`;
            }
        }
        return s;
    }

    static url(url:string, query?:WebAtoms.NameValuePairs, hash?:WebAtoms.NameValuePairs):string {
        if(!url) {
            return url;
        }
        var p:string = Atom.encodeParameters(query);
        if(p) {
            if(url.indexOf("?")===-1) {
                url += "?";
            }
            url += p;
        }
        p = Atom.encodeParameters(hash);
        if(p) {
            if(url.indexOf("#") === -1) {
                url += "#";
            }
            url += p;
        }
        return url;
    }

    static watch():WebAtoms.AtomDisposable {
        return new WebAtoms.AtomDisposable(()=> {
            console.log("Disposed");
        });
    }

}
