import { AtomUI } from "../web/core/AtomUI";
import { INameValuePairs, INameValues } from "./types";

export class AtomUri {
    public protocol: string;
    public path: string;
    public query: INameValues;
    public hash: INameValues;
    // public scheme: string;
    public host: string;
    public port: string;

    /**
     *
     */
    constructor(url: string) {
        let path: string ;
        let query: string = "";
        let hash: string  = "";
        let t: string[] = url.split("?");
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

        let scheme: string = "";
        let host: string = "";
        let port: string = "";

        let i: number = path.indexOf("//");
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

    public toString(): string {
        const q: string[] = [];
        const h: string[] = [];
        for (const key in this.query) {
            if (this.query.hasOwnProperty(key)) {
                const element = this.query[key];
                if (element === undefined || element === null) {
                    continue;
                }
                q.push(`${encodeURIComponent(key)}=${encodeURIComponent(element.toString())}`);
            }
        }
        for (const key in this.hash) {
            if (this.hash.hasOwnProperty(key)) {
                const element = this.hash[key];
                if (element === undefined || element === null) {
                    continue;
                }
                h.push(`${encodeURIComponent(key)}=${encodeURIComponent(element.toString())}`);
            }
        }
        const qstr = q.length ? "?" + q.join("&")  : "";
        const hash = h.length ? "#" + h.join("&") : "";
        const port = this.port ? ":" + this.port : "";
        let path: string = this.path || "/";
        if (path.startsWith("/")) {
            path = path.substr(1);
        }
        return `${this.protocol}//${this.host}${port}/${path}${qstr}${hash}`;
    }
}
