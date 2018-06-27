// tslint:disable:no-console
import { TestMethod } from "./TestMethod";

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

        const promises = this.tests.map( async (peek) => {
            this.executed.push(peek);
            const test = new (peek.testClass)();
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
                    peek.error = peek.error ?
                        peek.error + er : er;
                }
            }
        });

        await Promise.all(promises);

        this.printAll();

        // const peek: TestMethod = this.tests.shift();

        // this.executed.push(peek);

        // const test: TestItem = new (peek.testClass as {new ()})();

        // try {
        //     await test.init();

        //     // tslint:disable-next-line:ban-types
        //     const fx: Function = test[peek.name];

        //     await this.runTest(fx, test);
        // } catch (e) {
        //     peek.error = e;
        // } finally {
        //     peek.logText = test.logText;
        //     try {
        //         await test.dispose();
        //     } catch (er) {
        //         peek.error = er;
        //     }
        // }

        // await this._run();

    }

}
