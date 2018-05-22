import * as types from "./core/types";

export class Atom {


    static encodeParameters(p:types.NameValuePair): string {
        if(!p) {
            return "";
        }
        var s:string = "";
        for (const key in p) {
            if (p.hasOwnProperty(key)) {
                const element = p[key];
                s += `&${key}=${encodeURIComponent(element)}`;                    
            }
        }
        return s;
    }

    static url(url:string, query?:types.NameValuePair, hash?:types.NameValuePair):string {
        if(!url) {
            return url;
        }
        var p:string = Atom.encodeParameters(query);
        if(p){
            if(url.indexOf('?')===-1){
                url += '?';
            }
            url += p;
        }
        p = Atom.encodeParameters(hash);
        if(p) {
            if(url.indexOf("#") === -1){
                url += "#";
            }
            url += p;
        }
        return url;
    }

}
