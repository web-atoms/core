import { AjaxOptions } from "./AjaxOptions";

import { App } from "../../App";
import { Atom } from "../../Atom";
import { AtomBridge } from "../../core/AtomBridge";
import { CancelToken, INameValuePairs } from "../../core/types";
import { Inject } from "../../di/Inject";
import { TypeKey } from "../../di/TypeKey";
import CacheService, { CacheSeconds } from "../CacheService";
import { IJsonParserOptions, JsonService } from "../JsonService";
import JsonError from "./JsonError";

declare var UMD: any;

export interface IHttpHeaders {
    [key: string]: string;
}

export interface IApiResponse<T> {
    headers?: IHttpHeaders;
    value?: T;
}

export interface IMethodOptions {

    /**
     * Cache value retrieved from server in JavaScript runtime for
     * given seconds
     */
    jsCacheSeconds?: CacheSeconds<any>;

    /**
     * Accept header, application/json if not set
     */
    accept?: string;

    /**
     * Other headers to pass along with the request
     */
    headers?: IHttpHeaders;

    /**
     * JsonService options to use with this request, use this only if naming strategy
     * is different for this request
     */
    jsonOptions?: IJsonParserOptions;

    /**
     * If you want to inspect response headers, pass this true, but make sure you have
     * return type as IApiResponse<T>
     */
    returnHeaders?: boolean;

}

// tslint:disable-next-line
function methodBuilder(method: string) {
    // tslint:disable-next-line
    return function (url: string, options: IMethodOptions) {
        // tslint:disable-next-line
        return function (target: BaseService, propertyKey: string, descriptor: any) {

            target.methods = target.methods || {};

            const a: any = target.methods[propertyKey] as ServiceParameter[];

            const oldFunction: any = descriptor.value;

            // tslint:disable-next-line:typedef
            descriptor.value = function(...args: any[]) {

                if (this.testMode || Atom.designMode) {

                    // tslint:disable-next-line:no-console
                    console.log(`Test Design Mode: ${url} .. ${args.join(",")}`);

                    const ro: any = oldFunction.apply(this, args);
                    if (ro) {
                        return ro;
                    }
                }
                const jsCache = options ? options.jsCacheSeconds : 0;
                if (jsCache) {
                    const cacheService: CacheService = this.app.resolve(CacheService);
                    const jArgs = args.map((arg) => arg instanceof CancelToken ? null : arg);
                    const key = `${this.constructor.name}:${method}:${url}:${JSON.stringify(jArgs)}`;
                    return cacheService.getOrCreate(key, (e) => {
                        e.ttlSeconds = jsCache;
                        return this.invoke(url, method, a, args, options);
                    });
                }
                return this.invoke(url, method, a, args, options);
            };
        };
    };
}

// tslint:disable-next-line
function parameterBuilder(paramName: string, defaultValue?: any) {

    // tslint:disable-next-line
    return function (key: string) {
        // console.log("Declaration");
        // console.log({ key:key});
        // tslint:disable-next-line
        return function (target: BaseService, propertyKey: string | symbol, parameterIndex: number) {
            // console.log("Instance");
            // console.log({ key:key, propertyKey: propertyKey,parameterIndex: parameterIndex });

            target.methods = target.methods || {};

            let a: any = target.methods[propertyKey];
            if (!a) {
                a = [];
                target.methods[propertyKey] = a;
            }
            a[parameterIndex] = new ServiceParameter(paramName, key, defaultValue);
        };

    };
}

export type RestAttr =
    (target: BaseService, propertyKey: string | symbol, parameterIndex: number)
        => void;

export type RestParamAttr = (key: string, defaultValue?: any)
    => RestAttr;

export type RestMethodAttr = (key: string, options?: IMethodOptions)
    => (target: BaseService, propertyKey: string | symbol, descriptor: any)
        => void;

/**
 * This will register Url path fragment on parameter.
 *
 * @example
 *
 *      @Get("/api/products/{category}")
 *      async getProducts(
 *          @Path("category")  category: number
 *      ): Promise<Product[]> {
 *      }
 *
 * @export
 * @function Path
 * @param {name} - Name of the parameter
 */
export const Path: RestParamAttr = parameterBuilder("Path");

/**
 * This will register header on parameter.
 *
 * @example
 *
 *      @Get("/api/products/{category}")
 *      async getProducts(
 *          @Header("x-http-auth")  category: number
 *      ): Promise<Product[]> {
 *      }
 *
 * @export
 * @function Path
 * @param {name} - Name of the parameter
 */
export const Header: RestParamAttr = parameterBuilder("Header");

/**
 * This will register Url query fragment on parameter.
 *
 * @example
 *
 *      @Get("/api/products")
 *      async getProducts(
 *          @Query("category")  category: number
 *      ): Promise<Product[]> {
 *      }
 *
 * @export
 * @function Query
 * @param {name} - Name of the parameter
 */
export const Query: RestParamAttr = parameterBuilder("Query");

/**
 * This will register Url query fragments on parameter of type object
 *
 * @example
 *
 *     @Get("/api/products")
 *     async getProducts(
 *          @Queries queries: { [key: string]: string | number | boolean | null }
 *     ): Promise<Product[]> {
 *         return null;
 * }
 */
export const Queries: RestAttr = parameterBuilder("Queries")("");

/**
 * This will register data fragment on ajax.
 *
 * @example
 *
 *      @Post("/api/products")
 *      async getProducts(
 *          @Query("id")  id: number,
 *          @Body product: Product
 *      ): Promise<Product[]> {
 *      }
 *
 * @export
 * @function Body
 */
export const Body: RestAttr = parameterBuilder("Body")("");

export const RawBody: RestAttr = parameterBuilder("RawBody")("");

/**
 * This will register data fragment on ajax in old formModel way.
 *
 * @example
 *
 *      @Post("/api/products")
 *      async getProducts(
 *          @Query("id")  id: number,
 *          @BodyFormModel product: Product
 *      ): Promise<Product[]> {
 *      }
 *
 * @export
 * @function BodyFormModel
 */
export const BodyFormModel: RestAttr = parameterBuilder("BodyFormModel")("");

export const XmlBody: RestAttr = parameterBuilder("XmlBody")("");

/**
 * Http Post method
 * @example
 *
 *      @Post("/api/products")
 *      async saveProduct(
 *          @Body product: Product
 *      ): Promise<Product> {
 *      }
 *
 * @export
 * @function Post
 * @param {url} - Url for the operation
 */
export const Post: RestMethodAttr = methodBuilder("Post");

/**
 * Http Get Method
 *
 * @example
 *
 *      @Get("/api/products/{category}")
 *      async getProducts(
 *          @Path("category") category?:string
 *      ): Promise<Product[]> {
 *      }
 *
 * @export
 * @function Body
 */
export const Get: RestMethodAttr = methodBuilder("Get");

/**
 * Http Delete method
 * @example
 *
 *      @Delete("/api/products")
 *      async deleteProduct(
 *          @Body product: Product
 *      ): Promise<Product> {
 *      }
 *
 * @export
 * @function Delete
 * @param {url} - Url for the operation
 */
export const Delete: RestMethodAttr = methodBuilder("Delete");

/**
 * Http Put method
 * @example
 *
 *      @Put("/api/products")
 *      async saveProduct(
 *          @Body product: Product
 *      ): Promise<Product> {
 *      }
 *
 * @export
 * @function Put
 * @param {url} - Url for the operation
 */
export const Put: RestMethodAttr = methodBuilder("Put");

/**
 * Http Patch method
 * @example
 *
 *      @Patch("/api/products")
 *      async saveProduct(
 *          @Body product: any
 *      ): Promise<Product> {
 *      }
 *
 * @export
 * @function Patch
 * @param {url} - Url for the operation
 */
export const Patch: RestMethodAttr = methodBuilder("Patch");

/**
 * Cancellation token
 * @example
 *
 *      @Put("/api/products")
 *      async saveProduct(
 *          @Body product: Product
 *          @Cancel cancel: CancelToken
 *      ): Promise<Product> {
 *      }
 *
 * @export
 * @function Put
 * @param {url} - Url for the operation
 */
export function Cancel(target: BaseService, propertyKey: string | symbol, parameterIndex: number): void {
    if (!target.methods) {
        target.methods = {};
    }

    let a: ServiceParameter[] = target.methods[propertyKey];
    if (!a) {
        a = [];
        target.methods[propertyKey] = a;
    }
    a[parameterIndex] = new ServiceParameter("cancel", "");
}

export class ServiceParameter {

    constructor(
        public readonly type: string,
        public readonly key: string,
        public readonly defaultValue?: any) {
        this.type = type.toLowerCase();
        this.key = key;
    }
}

export default function BaseUrl(baseUrl: string): ((target: any) => void) {
    return (target: any): void => {
        const key = TypeKey.get(target);
        BaseService.baseUrls[key] = baseUrl;
    };
}

declare var global: any;
declare var window: any;
declare var require: any;

const globalNS = (typeof global !== "undefined") ? global : window;

if (!globalNS.XMLHttpRequest) {
    // tslint:disable-next-line: no-var-requires
    globalNS.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
}

/**
 *
 *
 * @export
 * @class BaseService
 */
export class BaseService {

    public static baseUrls: {[key: string]: string } = {};

    public baseUrl: string;

    public testMode: boolean = false;

    public showProgress: boolean = true;

    public showError: boolean = false;

    // bs

    public methods: any = {};

    public methodReturns: any = {};

    public jsonOptions: IJsonParserOptions = null;

    public headers: {[key: string]: string | number | null | undefined} = null;

    constructor(
        @Inject protected readonly app: App,
        @Inject public readonly jsonService: JsonService
    ) {
        this.jsonOptions = {
            ... this.jsonService.options
        };
    }

    protected encodeData(o: AjaxOptions): AjaxOptions {
        o.dataType = "application/json";
        o.data = this.jsonService.stringify(o.data, this.jsonOptions);
        o.contentType = "application/json";
        return o;
    }

    protected sendResult(result: any, error?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (error) {
                setTimeout(() => {
                    reject(error);
                }, 1);
                return;
            }
            setTimeout(() => {
                resolve(result);
            }, 1);
        });
    }

    protected async invoke(
        url: string,
        method: string,
        bag: ServiceParameter[],
        values: any[], methodOptions: IMethodOptions): Promise<any> {

        if (this.baseUrl === undefined) {
            let p = Object.getPrototypeOf(this);
            while (p) {
                const t = TypeKey.get(p.constructor || p);
                const bu = BaseService.baseUrls[t];
                if (bu) {
                    this.baseUrl = bu;
                    break;
                }
                p = Object.getPrototypeOf(p);
            }
            if (this.baseUrl === undefined) {
                this.baseUrl = null;
            }
        }

        if (this.baseUrl) {
            if (!/^\//.test(url)) {
                url = `${this.baseUrl}${url}`;
            }
        }

        const busyIndicator = this.showProgress ? ( this.app.createBusyIndicator() ) : null;

        try {

            url = UMD.resolvePath(url);

            let options: AjaxOptions = new AjaxOptions();
            options.method = method;

            if (methodOptions) {
                options.headers = methodOptions.headers;
                options.dataType = methodOptions.accept;
            }

            const methodHeaders = (options.headers = options.headers || {});

            const headers = this.headers
                ? ({ ... this.headers, ...  methodHeaders })
                : methodHeaders;

            // this is necessary to support IsAjaxRequest in ASP.NET MVC
            if (!headers["X-Requested-With"]) {
                headers["X-Requested-With"] = "XMLHttpRequest";
            }

            options.dataType = options.dataType || "application/json";

            const jsonOptions = {
                ... this.jsonOptions,
                ... (methodOptions ? methodOptions.jsonOptions : {})
            };

            if (bag) {

                for (let i: number = 0; i < bag.length; i++) {
                    const p: ServiceParameter = bag[i];
                    const vi = values[i];
                    const v: any = vi === undefined ? p.defaultValue : vi;
                    if (v instanceof CancelToken) {
                        options.cancel = v;
                        continue;
                    }
                    switch (p.type) {
                        case "path":
                            if (v === undefined) {
                                continue;
                            }
                            const vs: string = v + "";
                            const replacer = `{${p.key}}`;
                            url = url.split(replacer).join(vs);
                            break;
                        case "query":
                            if (v === undefined) {
                                continue;
                            }
                            if (url.indexOf("?") === -1) {
                                url += "?";
                            }
                            if (! /(\&|\?)$/.test(url)) {
                                url += "&";
                            }
                            url += `${encodeURIComponent(p.key)}=${encodeURIComponent(v)}`;
                            break;
                        case "queries":
                            if (url.indexOf("?") === -1) {
                                url += "?";
                            }
                            if (! /(\&|\?)$/.test(url)) {
                                url += "&";
                            }
                            for (const key in v) {
                                if (v.hasOwnProperty(key)) {
                                    const element = v[key];
                                    if (element !== undefined) {
                                        url += `${encodeURIComponent(key)}=${encodeURIComponent(element)}&`;
                                    }
                                }
                            }
                            break;
                        case "body":
                            options.data = v;
                            options = this.encodeData(options);
                            break;
                        case "bodyformmodel":
                            options.data = v;
                            break;
                        case "rawbody":
                            options.data = v;
                            break;
                        case "xmlbody":
                            options.contentType = "text/xml";
                            options.data = v;
                            break;
                        case "cancel":
                            options.cancel = v as CancelToken;
                            break;
                        case "header":
                            if (v === undefined) {
                                continue;
                            }
                            headers[p.key] = v;
                            break;
                    }
                }
            }
            options.url = url;

            const xhr = await this.ajax(url, options);

            if (/json/i.test(xhr.responseType)) {
                const text = xhr.responseText;
                const response = this.jsonService.parse(text, jsonOptions );

                if (xhr.status >= 400) {
                    throw new JsonError(
                        typeof response === "string"
                        ? response
                        : ( response.exceptionMessage
                        || response.message
                        || text
                        || "Json Server Error"), response);
                }
                if (methodOptions && methodOptions.returnHeaders) {
                    return {
                        headers: this.parseHeaders(xhr.responseHeaders),
                        value: response
                    };
                }
                return response;
            }
            if (xhr.status >= 400) {
                throw new Error(xhr.responseText || "Server Error");
            }

            if (methodOptions && methodOptions.returnHeaders) {
                return {
                    headers: this.parseHeaders(xhr.responseHeaders),
                    value: xhr.responseText
                };
            }
            return xhr.responseText;
        } finally {
            if (busyIndicator) {
                busyIndicator.dispose();
            }
        }

    }

    protected parseHeaders(headers: string | any): IHttpHeaders {
        if (typeof headers === "object") {
            return headers;
        }
        return (headers || "")
                    .split("\n")
                    .reduce((pv: IHttpHeaders, c: string) => {
                        const cv = c.split(":");
                        pv[cv[0]] = (cv[1] || "").trim();
                        return pv;
                    }, {});
    }

    protected async ajax(url: string, options: AjaxOptions): Promise<AjaxOptions> {

        // return new CancellablePromise();

        url = url || options.url;

        // no longer needed, watch must provide functionality of waiting and cancelling
        // await Atom.delay(1, options.cancel);

        if (options.cancel && options.cancel.cancelled) {
            throw new Error("cancelled");
        }

        if (AtomBridge.instance.ajax) {
            return await new Promise<AjaxOptions>((resolve, reject) => {
                AtomBridge.instance.ajax(url, options, (r) => {
                    resolve(options);
                }, (e) => {
                    reject(e);
                }, null);
            });
        }

        const xhr = new XMLHttpRequest();

        return await new Promise<AjaxOptions>((resolve, reject) => {

            if (options.cancel && options.cancel.cancelled) {
                reject(options.cancel.cancelled);
                return;
            }

            if (options.cancel) {
                options.cancel.registerForCancel((r) => {
                    xhr.abort();
                    reject(r);
                    return;
                });
            }

            xhr.onreadystatechange = (e) => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    options.status = xhr.status;
                    options.responseText = xhr.responseText;
                    // options.responseHeaders = (xhr.getAllResponseHeaders())
                    //     .split("\n")
                    //     .map((s) => s.trim().split(":"))
                    //     .reduce((pv, cv) => pv[cv[0]] = cv[1], {});
                    options.responseHeaders = xhr.getAllResponseHeaders();
                    const ct = xhr.getResponseHeader("content-type");
                    options.responseType = ct || xhr.responseType;
                    resolve(options);
                }
            };

            xhr.open(options.method, url, true);

            if (options.dataType) {
                xhr.setRequestHeader("accept", options.dataType);
            }

            if (options.contentType) {
                xhr.setRequestHeader("content-type", options.contentType);
            }

            const h = options.headers;
            if (h) {
                for (const key in h) {
                    if (h.hasOwnProperty(key)) {
                        const element = h[key];
                        xhr.setRequestHeader(key, element.toString());
                    }
                }
            }

            try {
                xhr.send(options.data);
            } catch (e) {
                options.status = xhr.status;
                options.responseText = xhr.responseText;
                // options.responseHeaders = (xhr.getAllResponseHeaders())
                //     .split("\n")
                //     .map((s) => s.trim().split(":"))
                //     .reduce((pv, cv) => pv[cv[0]] = cv[1], {});
                options.responseHeaders = xhr.getAllResponseHeaders();
                const ct = xhr.getResponseHeader("content-type");
                options.responseType = ct || xhr.responseType;
                resolve(options);
            }

        });

    }

}
