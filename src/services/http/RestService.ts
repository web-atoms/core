import { AjaxOptions } from "./AjaxOptions";

import { App } from "../../App";
import { Atom } from "../../Atom";
import { AtomBridge } from "../../core/AtomBridge";
import { CancelToken, INameValuePairs } from "../../core/types";
import { Inject } from "../../di/Inject";
import { JsonService } from "../JsonService";
import JsonError from "./JsonError";

declare var UMD: any;

// tslint:disable-next-line
function methodBuilder(method: string) {
    // tslint:disable-next-line
    return function (url: string, responseType: string = "application/json") {
        // tslint:disable-next-line
        return function (target: BaseService, propertyKey: string, descriptor: any) {

            target.methods = target.methods || {};

            const a: any = target.methods[propertyKey] as ServiceParameter[];

            const oldFunction: any = descriptor.value;

            // tslint:disable-next-line:typedef
            descriptor.value = function(...args: any[]) {

                if (this.testMode || Atom.designMode) {

                    // tslint:disable-next-line:no-console
                    console.log(`Test\Design Mode: ${url} .. ${args.join(",")}`);

                    const ro: any = oldFunction.apply(this, args);
                    if (ro) {
                        return ro;
                    }
                }

                const r: any = this.invoke(url, method, a, args, responseType);
                return r;
            };

            // console.log("methodBuilder called");
            // console.log({ url: url, propertyKey: propertyKey,descriptor: descriptor });
        };
    };
}

// tslint:disable-next-line
export function Return(type: { new() }) {
    // tslint:disable-next-line
    return function (target: BaseService, propertyKey: string, descriptor: any) {
        if (!target.methodReturns) {
            target.methodReturns = {};
        }
        target.methodReturns[propertyKey] = type;
    };
}

// tslint:disable-next-line
function parameterBuilder(paramName: string) {

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
            a[parameterIndex] = new ServiceParameter(paramName, key);
        };

    };
}

export type RestAttr =
    (target: BaseService, propertyKey: string | symbol, parameterIndex: number)
        => void;

export type RestParamAttr = (key: string)
    => RestAttr;

export type RestMethodAttr = (key: string)
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

    public key: string;
    public type: string;

    constructor(type: string, key: string) {
        this.type = type.toLowerCase();
        this.key = key;
    }
}

// /**
//  *
//  *
//  * @export
//  * @class CancellablePromise
//  * @implements {Promise<T>}
//  * @template T
//  */
// export class CancellablePromise<T> implements Promise<T> {

//     public [Symbol.toStringTag]: "Promise";

//     public onCancel: () => void;
//     public p: Promise<T>;
//     constructor(p: Promise<T>, onCancel: () => void) {
//         this.p = p;
//         this.onCancel = onCancel;
//     }

//     public abort(): void {
//         this.onCancel();
//     }

//     public then<TResult1 = T, TResult2 = never>(
//         onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
//         onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null):
//         Promise<TResult1 | TResult2> {
//         return this.p.then(onfulfilled, onrejected);
//     }

//     public catch<TResult = never>(onrejected?:
//         ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
//         return this.p.catch(onrejected);
//     }
// }

/**
 *
 *
 * @export
 * @class BaseService
 */
export class BaseService {

    public testMode: boolean = false;

    public showProgress: boolean = true;

    public showError: boolean = false;

    // bs

    public methods: any = {};

    public methodReturns: any = {};

    constructor(
        @Inject protected readonly app: App,
        @Inject public readonly jsonService: JsonService
    ) {

    }

    protected encodeData(o: AjaxOptions): AjaxOptions {
        o.dataType = "application/json";
        o.data = this.jsonService.stringify(o.data);
        o.contentType = "application/json";
        return o;
    }

    protected async sendResult(result: any, error?: any): Promise<any> {
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
        values: any[], responseType: string): Promise<any> {

        const busyIndicator = this.showProgress ? ( this.app.createBusyIndicator() ) : null;

        try {

            url = UMD.resolvePath(url);

            let options: AjaxOptions = new AjaxOptions();
            options.method = method;
            options.dataType = responseType;
            if (bag) {
                for (let i: number = 0; i < bag.length; i++) {
                    const p: ServiceParameter = bag[i];
                    const v: any = values[i];
                    switch (p.type) {
                        case "path":
                            const vs: string = v + "";
                            // escaping should be responsibility of the caller
                            // vs = vs.split("/").map(s => encodeURIComponent(s)).join("/");
                            url = url.replace(`{${p.key}}`, vs);
                            break;
                        case "query":
                            if (url.indexOf("?") === -1) {
                                url += "?";
                            }
                            url += `&${p.key}=${encodeURIComponent(v)}`;
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
                            options.headers = options.headers = {};
                            options.headers[p.key] = v;
                            break;
                    }
                }
            }
            options.url = url;

            const xhr = await this.ajax(url, options);

            let response: any = xhr.responseText;

            if (options.dataType && /json/i.test(options.dataType)) {
                response = this.jsonService.parse(xhr.responseText);

                if (xhr.status >= 400) {
                    throw new JsonError("Json Server Error", response);
                }
            }
            if (xhr.status >= 400) {
                throw new Error(xhr.responseText);
            }

            return response;
        } finally {
            if (busyIndicator) {
                busyIndicator.dispose();
            }
        }

        // const rp: Promise<any> = new Promise(
        //     (resolve, reject) => {

        //     pr.then(() => {
        //         const v: any = pr.value();

        //         // deep clone...
        //         // var rv = new returns();
        //         // reject("Clone pending");

        //         if (options.cancel) {
        //             if (options.cancel.cancelled) {
        //                 reject("cancelled");
        //                 return;
        //             }
        //         }

        //         resolve(v);
        //     });
        //     pr.failed(() => {
        //         reject(pr.error.msg);
        //     });

        //     pr.showError(this.showError);
        //     pr.showProgress(this.showProgress);
        //     pr.invoke("Ok");
        // });

        // return new CancellablePromise(rp, () => {
        //     pr.abort();
        // });
    }

    protected async ajax(url: string, options: AjaxOptions): Promise<AjaxOptions> {

        // return new CancellablePromise();

        url = url || options.url;

        await Atom.delay(100, options.cancel);

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
                reject("cancelled");
                return;
            }

            if (options.cancel) {
                options.cancel.registerForCancel(() => {
                    xhr.abort();
                    reject("cancelled");
                    return;
                });
            }

            xhr.onreadystatechange = (e) => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    // if (options.dataType && /json/i.test(options.dataType)) {
                    //     resolve(JSON.parse(xhr.responseText));
                    // } else {
                    //     resolve(xhr.responseText);
                    // }
                    options.status = xhr.status;
                    options.responseText = xhr.responseText;
                    options.responseType = xhr.responseType;
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

//            if (options.data) {
            xhr.send(options.data);
//            }

        });

        // throw new Error("Not implemented");
        // return new CancellablePromise()
        // let p: AtomPromise = new AtomPromise();

        // options.success = p.success;
        // options.error = p.error;

        // // caching is disabled by default...
        // if (options.cache === undefined) {
        //     options.cache = false;
        // }

        // let u: string = url;

        // let o: AjaxOptions = options;

        // let attachments: any[] = o.attachments;
        // if (attachments && attachments.length) {
        //     let fd: FormData = new FormData();
        //     let index: number = 0;
        //     for (const file of attachments) {
        //         fd.append(`file${index}`, file);
        //     }
        //     if (o.data) {
        //         for (const k in o.data) {
        //             if (k) {
        //                 fd.append(k, o.data[k]);
        //             }
        //         }
        //     }
        //     o.type = "POST";
        //     o.xhr = () => {
        //         const myXhr: any = $.ajaxSettings.xhr();
        //         if (myXhr.upload) {
        //             myXhr.upload.addEventListener("progress", e => {
        //                 if (e.lengthComputable) {
        //                     const percentComplete: any = Math.round(e.loaded * 100 / e.total);
        //                     // AtomBinder.setValue(atomApplication, "progress", percentComplete);
        //                 }
        //             }, false);
        //         }
        //         return myXhr;
        //     };
        //     o.cache = false;
        //     o.contentType = null;
        //     o.processData = false;
        // }

        // if (url) {
        //     p.onInvoke(() => {
        //         p.handle = $.ajax(u, o);
        //     });
        // }

        // p.failed(() => {

        //     let res: string = p.errors[0].responseText;
        //     if (!res) {
        //         if (!res || p.errors[2] !== "Internal Server Error") {
        //             const m: string = p.errors[2];
        //             if (m) {
        //                 res = m;
        //             }
        //         }
        //     }

        //     p.error = {
        //         msg: res
        //     };
        // });

        // p.then(p => {
        //     let v: any = p.value();
        //     v = AtomPromise.parseDates(v);
        //     if (v && v.items && v.merge) {
        //         v.items.total = v.total;
        //         v = v.items;
        //         p.value(v);
        //     }
        // });

        // p.showError(true);
        // p.showProgress(true);

        // return p;
    }

}
