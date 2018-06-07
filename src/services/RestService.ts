import { Atom } from "../Atom";
import { CancelToken } from "../core/types";

// tslint:disable-next-line
function methodBuilder(method: string) {
    // tslint:disable-next-line
    return function (url: string) {
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

                let rn: any = null;
                if (target.methodReturns) {
                    rn = target.methodReturns[propertyKey];
                }
                const r: any = this.invoke(url, method, a, args, rn);
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

export class AjaxOptions {
    public dataType: string;
    public contentType: string;
    public method: string;
    public url: string;
    public data: any;
    public type: string;
    public cancel: CancelToken;
    public headers: any;
    public inputProcessed: boolean;
    // tslint:disable-next-line:ban-types
    public success: Function;
    public error: any;
    public cache: any;
    public attachments: any[];
    public xhr: any;
    public processData: boolean;
}

/**
 *
 *
 * @export
 * @class CancellablePromise
 * @implements {Promise<T>}
 * @template T
 */
export class CancellablePromise<T> implements Promise<T> {

    public [Symbol.toStringTag]: "Promise";

    public onCancel: () => void;
    public p: Promise<T>;
    constructor(p: Promise<T>, onCancel: () => void) {
        this.p = p;
        this.onCancel = onCancel;
    }

    public abort(): void {
        this.onCancel();
    }

    public then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null):
        Promise<TResult1 | TResult2> {
        return this.p.then(onfulfilled, onrejected);
    }

    public catch<TResult = never>(onrejected?:
        ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
        return this.p.catch(onrejected);
    }
}

/**
 *
 *
 * @export
 * @class BaseService
 */
export class BaseService {

    public static cloneObject(dupeObj: any): any {
        if (typeof (dupeObj) === "object") {
            if (typeof (dupeObj.length) !== "undefined") {
                const ra = new Array();
                for (const iterator of dupeObj) {
                    (ra as any[]).push(BaseService.cloneObject(iterator));
                }
                return ra;
            }
            const retObj: any = {};
            for (const objInd in dupeObj) {
                if (!objInd || /^\_\$\_/gi.test(objInd)) {
                    continue;
                }
                const val: any = dupeObj[objInd];
                if (val === undefined || val === null) {
                    continue;
                }
                const type: string = typeof (val);
                if (type === "object") {
                    if (val.constructor === Date) {
                        retObj[objInd] = (val as Date).toJSON();
                    } else {
                        retObj[objInd] = BaseService.cloneObject(val);
                    }
                } else if (type === "date") {
                    retObj[objInd] = (val as Date).toJSON();
                } else {
                    retObj[objInd] = val;
                }
            }
            return retObj;
        }
        return dupeObj;
    }

    public testMode: boolean = false;

    public showProgress: boolean = true;

    public showError: boolean = false;

    // bs

    public methods: any = {};

    public methodReturns: any = {};

    public encodeData(o: AjaxOptions): AjaxOptions {
        o.inputProcessed = true;
        o.dataType = "json";
        o.data = JSON.stringify(BaseService.cloneObject(o.data));
        o.contentType = "application/json";
        return o;
    }

    public async sendResult(result: any, error?: any): Promise<any> {
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

    public async invoke(
        url: string,
        method: string,
        bag: ServiceParameter[],
        values: any[], returns: { new() }): Promise<any> {

        let options: AjaxOptions = new AjaxOptions();
        options.method = method;
        options.type = method;
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
                        options.inputProcessed = false;
                        options.data = v;
                        break;
                    case "cancel":
                        options.cancel = v as CancelToken;
                        break;
                    case "header":
                        options.headers = options.headers = {};
                        options.headers[p.key] = p;
                        break;
                }
            }
        }
        options.url = url;

        const pr = this.ajax(url, options);

        if (options.cancel) {
            options.cancel.registerForCancel(() => {
                pr.abort();
            });
        }

        return pr;

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

    public ajax(url: string, options: AjaxOptions): CancellablePromise<any> {
        throw new Error("Not implemented");
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
