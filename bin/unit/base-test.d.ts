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
    logs: any[];
    errors: any[];
    log(a: any): void;
    error(a: any): void;
    reset(): void;
}
export declare class TestMethod {
    name: string;
    category: string;
    description: any;
    testClass: any;
    error: any;
    logText: string;
    constructor(desc: any, name: string, category: string, target: any);
    readonly path: string;
}
export declare class TestItem {
    logText: string;
    init(): Promise<any>;
    dispose(): Promise<any>;
    log(text: string): void;
    delay(n: number): Promise<any>;
}
export declare function Test(name?: string): (target: TestItem, propertyKey: string, descriptor: any) => void;
export declare class TestRunner {
    private static _instance;
    static readonly instance: TestRunner;
    tests: TestMethod[];
    executed: TestMethod[];
    constructor();
    printAll(): void;
    runTest(f: any, target: any): Promise<any>;
    run(filter?: string): Promise<any>;
    _run(): Promise<any>;
}
