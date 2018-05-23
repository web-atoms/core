import { NameValuePairs, NameValues } from "./types";
import { AtomUI } from "./atom-ui";

export class AtomUri {
    protocol: string;
    path: string;
    query: NameValues;
    hash: NameValues;
    scheme: string;
    host: string;
    port: string;

    /**
     *
     */
    constructor(url: string) {
        var path: string ;
        var query: string = "";
        var hash:string  = "";
        var t:string[] = url.split("?");
        path = t[0];
        if (t.length === 2) {
            query = t[1] || "";

            t = query.split("#");
            query = t[0];
            hash = t[1] || "";
        } else {
            t = path.split("#");
            path = t[0];
            hash = t[1] || "";
        }

        // extract protocol and domain...

        var scheme: string = location.protocol;
        var host:string = location.host;
        var port:string = location.port;

        var i:number = path.indexOf("//");
        if (i !== -1) {
            scheme = path.substr(0, i);
            path = path.substr(i + 2);


            i = path.indexOf("/");
            if (i !== -1) {
                host = path.substr(0, i);
                path = path.substr(i + 1);
                t = host.split(":");
                if (t.length > 1) {
                    host = t[0];
                    port = t[1];
                }
            }
        }
        this.host = host;
        this.protocol = scheme;
        this.port = port;
        this.path = path;



        this.query = AtomUI.parseUrl(query);
        this.hash = AtomUI.parseUrl(hash);
    }
}