
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
