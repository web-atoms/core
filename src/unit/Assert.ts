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
