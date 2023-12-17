import { CancelToken } from "../core/types";
import JsonError from "./http/JsonError";

export function buildUrl(strings: TemplateStringsArray, ... p: any[]) {
    let r = "";
    for (let index = 0; index < strings.length; index++) {
        const element = strings[index];
        r += element;
        if(index < p.length) {
            r += encodeURIComponent(p[index]);
        }
    }
    return r;
}

type IBuilder = (r: Request) => Request;

type IRequest = { url?: string } & RequestInit;

export default class FetchBuilder {

    public static get(url) {
        return this.method(url, "GET");
    }

    public static put(url) {
        return this.method(url, "PUT");
    }

    public static post(url) {
        return this.method(url, "POST");
    }

    public static delete(url) {
        return this.method(url, "DELETE");
    }

    public static method(url, method: string) {
        return new FetchBuilder({ url, method });
    }

    private constructor(private readonly request: IRequest) {
    }

    public cancelToken(cancelToken: CancelToken) {
        const ac = new AbortController();
        cancelToken.registerForCancel(() => ac.abort());
        return this.signal(ac.signal);
    }

    public signal(signal: AbortSignal) {
        return this.append({
            signal
        });
    }

    public form(name: string, value: Blob);
    public form(name: string, value: Blob, fileName: string);
    public form(name: string, value: string | Blob, fileName?: string ) {
        const body = this.request.body as FormData ?? new FormData();
        if (fileName) {
            if (typeof value === "string") {
                throw new Error("value must be a blob with content type set correctly.");
            }
            body.append(name, value as Blob, fileName)
        } else {
            body.append(name, value);
        }
        return this.append ({ body });
    }

    public jsonBody(body, encode = true) {
        if (encode) {
            body = JSON.stringify(body);
        }
        const headers = this.request.headers ?? {};
        headers["content-type"] = "application/json";
        return this.append ({ body, headers });
    }

    public header(name: string, value: string) {
        const headers = this.request.headers ?? {};
        headers[name] = value;
        return this.append({ headers });
    }

    public path(name: string, value: any, encode = true) {
        let url = this.request.url;
        if (encode) {
            value = encodeURIComponent(value);
        }
        url = url.replace(name, value);
        return this.append({ url });
    }

    public query(name: string, value: any, encode = true) {
        let url = this.request.url;
        if (encode) {
            value = encodeURIComponent(value);
        }
        name = encodeURIComponent(name);
        if (url.indexOf("?") === -1) {
            url += `?${name}=${value}`;
        } else {
            url += `&${name}=${value}`;
        }
        return this.append({ url });
    }

    public async responseAsText(ensureSuccess = true) {
        const r = await this.response();
        if (ensureSuccess) {
            await this.ensureSuccess(r);
        }
        return await r.text();
    }

    public async responseAsBlob(ensureSuccess = true) {
        const r = await this.response();
        if (ensureSuccess) {
            await this.ensureSuccess(r);
        }
        return await r.blob();
    }

    public async responseAsJson<T>(ensureSuccess = true) {
        const r = await this.response();
        if (ensureSuccess) {
            await this.ensureSuccess(r);
        }
        return (await r.json()) as T;
    }

    public response() {
        return fetch(this.request.url, this.request);
    }

    private async ensureSuccess(r: Response) {
        if (r.status <= 300) {
            return;
        }
        // is json...
        const type = r.headers.get("content-type");
        if (/\/json/i.test(type)) {
            const json = await r.json();
            throw new JsonError(`Failed for ${this.request.url}`, json);
        }
        const text = await r.text();
        throw new Error(`Failed for ${this.request.url}\n${text}`);
    }

    private append(r: IRequest) {
        return new FetchBuilder({ ... this.request, ... r});
    }

}