
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