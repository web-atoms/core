import { AtomDispatcher } from "./core/atom-dispatcher";
import { CancelToken, INameValuePairs } from "./core/types";

export class Atom {

    public static set(arg0: any, arg1: any, arg2: any): any {
        throw new Error("Method not implemented.");
    }
    /**
     * Await till given milliseconds have passed
     * @param n
     * @param ct
     */
    public static delay(n: number, ct?: CancelToken): Promise<any> {
        return new Promise((resolve, reject) => {
            const h: any = {};
            h.id = setTimeout(() => {
                if (ct && ct.cancelled) {
                    return;
                }
                resolve();
            }, n);
            if (ct) {
                ct.registerForCancel(() => {
                    clearTimeout(h.id);
                });
            }
        });
    }

    // tslint:disable-next-line:member-access
    static query(arg0: any): any {
        throw new Error("Method not implemented.");
    }

    public static encodeParameters(p: INameValuePairs): string {
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

    public static url(url: string, query?: INameValuePairs, hash?: INameValuePairs): string {
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

    /**
     * Schedules given call in next available callLater slot and also returns
     * promise that can be awaited, calling `Atom.postAsync` inside `Atom.postAsync`
     * will create deadlock
     * @static
     * @param {()=>Promise<any>} f
     * @returns {Promise<any>}
     * @memberof Atom
     */
    public static postAsync(f: () => Promise<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            AtomDispatcher.instance.callLater( async () => {
                try {
                    await f();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

}
