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

    public static isNull(a: any, msg?: string): void {
        if (a !== null) {
            Assert.throw(msg || `Expected null found ${a}`);
        }
    }

    public static isUndefined(a: any, msg?: string): void {
        if (a !== undefined) {
            Assert.throw(msg || `Expected undefined found ${a}`);
        }
    }

    public static isEmpty(a: any, msg?: string): void {
        if (a) {
            Assert.throw(msg || `Expected empty found ${a}`);
        }
    }

    public static isNotNull(a: any, msg?: string): void {
        if (a === null) {
            Assert.throw(msg || `Expected not null found ${a}`);
        }
    }

    public static isNotUndefined(a: any, msg?: string): void {
        if (a === undefined) {
            Assert.throw(msg || `Expected not undefined found ${a}`);
        }
    }

    public static isNotEmpty(a: any, msg?: string): void {
        if (!a) {
            Assert.throw(msg || `Expected not empty found ${a}`);
        }
    }

    public static throw(message: string) {
        throw new Error(`Assertion Failed, ${message}`);
    }
}
