export declare class Assert {
    static equals(expected: any, result: any, msg?: string): void;
    static doesNotEqual(expected: any, result: any, msg?: string): void;
    static throws(expected: string, f: () => any, msg?: string): void;
    static throwsAsync(expected: string, f: () => Promise<any>, msg?: string): Promise<any>;
    static isTrue(b: boolean, msg?: string): void;
    static isFalse(b: boolean, msg?: string): void;
    static throw(message: string): void;
}
export declare function Category(name: string): (target: any) => any;
export declare class TestContext {
    logs: Array<any>;
    errors: Array<any>;
    log(a: any): void;
    error(a: any): void;
    reset(): void;
}
export declare class TestMethod {
    constructor(desc: any, name: string, category: string, target: any);
    name: string;
    category: string;
    description: any;
    testClass: any;
    readonly path: string;
    error: any;
    logText: string;
}
export declare class TestItem {
    logText: string;
    init(): Promise<any>;
    dispose(): Promise<any>;
    log(text: string): void;
    delay(n: number): Promise<any>;
}
export declare function Test(name?: string): Function;
export declare class TestRunner {
    private static _instance;
    static readonly instance: TestRunner;
    constructor();
    tests: Array<TestMethod>;
    executed: Array<TestMethod>;
    printAll(): void;
    runTest(f: any, target: any): Promise<any>;
    discover(...a: any[]): void;
    run(filter?: string): Promise<any>;
    _run(): Promise<any>;
}
