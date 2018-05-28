                // tslint:disable-next-line:no-console
// tslint:disable:no-console
export class Assert {

    public static equals(
        expected: any,
        result: any,
        msg?: string ) {
        if (result !== expected) {
            Assert.throw(msg || `Expected ${expected}, found ${result}`);
        }
    }

    public static doesNotEqual(
        expected: any,
        result: any,
        msg?: string) {
        if (result === expected) {
            Assert.throw(msg || `Not Expected ${expected}, found ${result}`);
        }
    }

    public static throws(
        expected: string,
        f: () => any,
        msg?: string) {
        try {
            f();
            Assert.throw(msg || `Expected ${expected}, no exception was thrown.`);
        } catch (e) {
            if (e.message !== expected) {
                Assert.throw(msg || `Expected error ${expected}, found ${e.message}`);
            }
        }
    }

    public static async throwsAsync(
        expected: string,
        f: () => Promise<any>,
        msg?: string ): Promise<any> {
        try {
            await f();
            Assert.throw(msg || `Expected ${expected}, no exception was thrown.`);
        } catch (e) {
            if (e.message !== expected) {
                Assert.throw(msg || `Expected error ${expected}, found ${e.message}`);
            }
        }
    }

    public static isTrue(b: boolean, msg?: string) {
        if (b !== true) {
            Assert.throw(msg || "Expected isTrue");
        }
    }

    public static isFalse(b: boolean, msg?: string) {
        if (b !== false) {
            Assert.throw(msg || "Expected isFalse");
        }
    }

    public static throw(message: string) {
        throw new Error(`Assertion Failed, ${message}`);
    }
}

export function Category(name: string) {

    return (target: any) => {

        // target.testCategory = name;
        // return target;

        // save a reference to the original constructor
        const original: any = target;

        // a utility function to generate instances of a class
        function construct(constructor, args) {
            const c: any = function() {
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }

        // the new constructor behaviour
        const f: any = function(...args) {
            this.testCategory = name;
            return construct(original, args);
        };

        // copy prototype so intanceof operator still works
        f.prototype = original.prototype;

        // return new constructor (will override original)
        return f;
    };
}

export class TestContext {

    public logs: any[] = [];
    public errors: any[] = [];

    public log(a: any): void {
        this.logs.push(a);
    }

    public error(a: any): void {
        this.errors.push(a);
    }

    public reset(): void {
        this.logs.length = 0;
        this.errors.length = 0;
    }

}

export class TestMethod {

    public name: string;
    public category: string;
    public description: any;

    public testClass: any;

    public error: any;

    public logText: string;

    constructor(desc: any, name: string, category: string, target: any) {
        this.description = desc;
        this.name = name;
        this.category = category;
        this.testClass = target;
    }

    get path(): string {
        return `${this.category}/${this.name}`;
    }

}

export class TestItem {

    public logText: string = "";

    public async init(): Promise<any> {
        return 0;
    }

    public async dispose(): Promise<any> {
        return 0;
    }

    public log(text: string): void {
        if (text) {
            this.logText += text;
        }
    }

    public delay(n: number): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, n);
        });
    }

}

export function Test(name?: string): (target: TestItem, propertyKey: string, descriptor: any) => void {
    return (target: TestItem, propertyKey: string, descriptor: any): void => {

        // console.log(`Test called for ${target.constructor.name} in ${propertyKey}`)
        TestRunner.instance.tests.push(new TestMethod(
            name || propertyKey,
            propertyKey,
            target.constructor.name,
            target.constructor ));
    };
}

export class TestRunner {

    // tslint:disable-next-line:variable-name
    private static _instance: TestRunner;
    static get instance(): TestRunner {
        if (!TestRunner._instance) {
            TestRunner._instance = new TestRunner();
        }
        return TestRunner._instance;
    }

    public tests: TestMethod[];
    public executed: TestMethod[];

    constructor() {
        this.tests = [];
        this.executed = [];
    }

    public printAll(): void {
        // var results = this.executed.sort((a,b)=>{
        //     return a.testClass.category.localeCompare(b.testClass.category);
        // });
        // var results = results.sort((a,b)=>{
        //     return a.description.localeCompare(b.description);
        // });
        for (const result of this.executed) {
            if (result.error) {

                console.error(`${result.category} > ${result.description} failed ${result.error.message}.`);
                console.error(result.error);
            } else {
                console.log(`${result.category} > ${result.description} succeeded.`);
            }
            if (result.logText) {
                console.log(`\t\t${result.logText}`);
            }
        }
    }

    public runTest(f: any, target: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const t: any = f.apply(target);
                if (t && t.then) {
                    t.then((v) => {
                        resolve(v);
                    });
                    t.catch((e) => {
                        reject(e);
                    });
                    return;
                }
                resolve();
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public async run(filter?: string): Promise<any> {

        if (filter) {
            let r: RegExp = null;
            if (filter.startsWith("/")) {
                const index: number = filter.lastIndexOf("/");
                const options: string = filter.substr(index + 1);
                filter = filter.substr(0, index);
                const exp: string = filter.substr(1);

                r = new RegExp(exp, options );

                this.tests = this.tests.filter( (x) => r.test(x.path) );

            } else {
                const categories: string[][] = filter.split(",").map((x) => x.trim().toLowerCase().split("."));
                this.tests = this.tests.filter( (x) => {
                    const lc: string = x.category.toLowerCase();
                    const ln: string = x.name.toLowerCase();
                    const b: any = categories.find( (c) => c[0] === lc && ((!c[1]) || ( c[1] === ln  )));
                    return b;
                });
            }
        }

        return this._run();

    }

    public async _run(): Promise<any> {

        if (this.tests.length === 0) {
            this.printAll();
            return;
        }

        const peek: TestMethod = this.tests.shift();

        this.executed.push(peek);

        const test: TestItem = new (peek.testClass as {new ()})();

        try {
            await test.init();

            // tslint:disable-next-line:ban-types
            const fx: Function = test[peek.name];

            await this.runTest(fx, test);
        } catch (e) {
            peek.error = e;
        } finally {
            peek.logText = test.logText;
            try {
                await test.dispose();
            } catch (er) {
                peek.error = er;
            }
        }

        await this._run();

    }

}
