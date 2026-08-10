import { App } from "../App.js";
import { CancelToken, IDisposable } from "../core/types.js";
import { BusyIndicatorService } from "./BusyIndicatorService.js";

type IRequest = {
    jsonPostProcessor?: (x) => any,
    dispatcher?: any,
    fetchProxy?: any,
    url?: string,
    hideBusyIndicator?,
    log?: (...a: any[]) => void, logError?: (...a: any[]) => void
} & RequestInit;

export default class FetchBuilder {

    static JsonError: typeof JsonError;
    
    static buildUrl(strings: TemplateStringsArray, ... p: any[]) {
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

    public static url(url: string) {
        return this.method(url, "GET");
    }

    public static header(name: string, value: string) {
        return new FetchBuilder({ url: "", method: "POST", headers: { [name]: value }});
    }

    public static method(url, method: string) {
        return new FetchBuilder({ url, method });
    }

    private constructor(private readonly request: IRequest) {
        request.headers ??= {};
    }

    public log(logger: (...a: any[]) => void) {
        return this.append({ log: logger });
    }

    public logWhenFailed(logger: (...a: any[]) => void) {
        return this.append({ logError: logger });
    }

    public get(url) {
        return this.method(url, "GET");
    }

    public put(url) {
        return this.method(url, "PUT");
    }

    public patch(url) {
        return this.method(url, "PATCH");
    }

    public post(url) {
        return this.method(url, "POST");
    }

    public delete(url) {
        return this.method(url, "DELETE");
    }

    public method(url: string, method: string ) {
        return this.append({ url, method });
    }

    // public cancelToken(cancelToken: CancelToken) {
    //     const ac = new AbortController();
    //     cancelToken.registerForCancel(() => ac.abort());
    //     return this.signal(ac.signal);
    // }

    public signal(signal: AbortSignal) {
        if (!signal) {
            return this;
        }
        return this.append({
            signal
        });
    }

    public cancelToken(ct: CancelToken) {
        if (!ct) {
            return this;
        }
        const ac = new AbortController();
        const signal = ac.signal;
        ct.registerForCancel(() => ac.abort());
        return this.signal(signal);
    }

    public form(name: string, value: string): FetchBuilder;
    public form(name: string, value: Blob, fileName: string): FetchBuilder;
    public form(name: string, value: string | Blob, fileName?: string ): FetchBuilder {
        if (value === void 0) {
            return this;
        }
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
        const headers = { ... this.request.headers ?? {} };
        headers["content-type"] = "application/json";
        return this.append ({ body, headers });
    }

    public header(name: string, value: string) {
        const headers = { ... this.request.headers ?? {} };
        if (value === null || value === undefined) {
            delete headers[name];
        }
        else  {
            headers[name] = value;
        }
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

    public query(name: any, value: any, encode = true) {
        if (value === void 0) {
            return this;
        }
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

    public queries(obj: { [key: string]: any}, encode = true, encodeObjectAsJson = true) {
        let url = this.request.url;
        let prefix = url.indexOf("?") === -1 ? "?" : "&";
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                let value = obj[key];
                if (value === void 0) {
                    continue;
                }
                if (encodeObjectAsJson) {
                    if (typeof value === "object" && value !== null) {
                        value = JSON.stringify(value);
                    }
                    encode = true;
                }
                if (encode) {
                    value = encodeURIComponent(value);
                }
                const name = encodeURIComponent(key);
                url += `${prefix}${name}=${value}`;
                prefix = "&"
            }
        }        
        return this.append({ url });
    }

    public async asText(ensureSuccess = true) {
        const { result } = await this.asTextResponse(ensureSuccess);
        return result;
    }

    public async asBlob(ensureSuccess = true) {
        const { result } = await this.asBlobResponse(ensureSuccess);
        return result;
    }

    public async asJson<T = any>(ensureSuccess = true) {
        const { result } = await this.asJsonResponse<T>(ensureSuccess);
        return result;
    }

    public jsonPostProcessor(jsonPostProcessor: (x) => any) {
        return this.append({ jsonPostProcessor });
    }

    public async asJsonResponse<T = any>(ensureSuccess = true) {
        return this.execute<T>(ensureSuccess, async (x, jsonPostProcessor) => {
            if(!/json/i.test(x.headers.get("content-type"))) {
                throw new Error(`Failed to parse json from ${this.request.url}\n${await x.text()}`);
            }
            if (jsonPostProcessor) {
                return x.json().then(jsonPostProcessor) as T;
            }
            return x.json() as T;
        });
    }

    public async asTextResponse(ensureSuccess = true) {
        return this.execute(ensureSuccess, (x) => x.text());
    }

    public asBlobResponse(ensureSuccess = true) {
        return this.execute(ensureSuccess, (x) => x.blob());
    }

    public dispatcher(dispatcher: any) {
        return this.append({ dispatcher });
    }

    public withFetchProxy(fetchProxy: any) {
        return this.append({ fetchProxy });
    }

    public async execute<T>(ensureSuccess = true,
        postProcessor: (r: Response, next?: (data) => any) => T | Promise<T>): Promise<{ result: T, headers: any, status: number }> {

        let { log, logError, hideBusyIndicator } = this.request;
        using _d = !hideBusyIndicator ? App.current?.createBusyIndicator() : null;
        try {

            const { headers, fetchProxy, jsonPostProcessor } = this.request;
            const r = await (fetchProxy ?? fetch)(this.request.url, this.request);
            if (ensureSuccess) {
                if (r.status > 300) {
                    log = logError;
                    log?.(`fetch: ${this.request.method ?? "GET"} ${this.request.url}`);
                    if (log && headers) {
                        for (const key in headers) {
                            if (headers.hasOwnProperty(key)) {
                                log?.(`${key}: ${headers[key]}`);
                            }
                        }
                    }
                    log?.(`${r.status} ${r.statusText || "Http Error"}`);
                    const type = r.headers.get("content-type");
                    if (/\/json/i.test(type)) {
                        const json: any = await r.json();
                        log?.(json);
                        const message = json.title
                        ?? json.detail
                        ?? json.message
                        ?? json.exceptionMessage
                        ?? "Json Server Error";
                        log = null;
                        logError = null;
                        throw new JsonError(message, json);
                    }
                    const text = await r.text();
                    log?.(text);
                    log = null;
                    logError = null;
                    throw new Error(`Fetch failed with error ${r.status} for ${this.request.url}\n${text}`);
                }
            }
            log?.(`${this.request.method ?? "GET"} ${this.request.url}`);
            if (log && headers) {
                for (const key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        log?.(`${key}: ${headers[key]}`);
                    }
                }
            }
            const result = await postProcessor(r, jsonPostProcessor);
            if (log) {
                log(`${r.status} ${r.statusText || "OK"}`)
                log(result);
            }
            return { result, headers: r.headers, status: r.status };
        } catch (error) {
            log?.(error);
            throw error;
        }
    }


    private append(r: IRequest) {

        // we will try to merge url here..
        let { url } = this.request;
        const { url: newUrl } = r;
        if (newUrl) {
            if (!url) {
                url = newUrl;
            } else {
                if (/^https?\:\/\//i.test(newUrl)) {
                    url = newUrl;
                } else {
                    let fullUrl = url;
                    if (!/^https?\:\/\//i.test(url)) {
                        fullUrl = new URL(url, location.href).toString();
                    }
                    url = (new URL(newUrl, fullUrl)).toString();
                }
            }
        }

        return new FetchBuilder({
            ... this.request,
            ... r,
            url
        });
    }

}

class JsonError extends Error {
    constructor(message, public readonly json) {
        super(message);
    }
}

FetchBuilder.JsonError = JsonError;

export class LegacyFetchBuilder {

    static get(url) {
        return LegacyFetchBuilder.requestedWith.get(url);
    }

    static post(url) {
        return LegacyFetchBuilder.requestedWith.post(url);
    }

    static put(url) {
        return LegacyFetchBuilder.requestedWith.put(url);
    }

    static delete(url) {
        return LegacyFetchBuilder.requestedWith.delete(url);
    }

    static patch(url) {
        return LegacyFetchBuilder.requestedWith.patch(url);
    }

    private static requestedWith = FetchBuilder.header("x-requested-with", "fetch")
}
