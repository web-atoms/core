export class App {

    constructor() {
        setTimeout(() => {
            this.onReady(() => this.main());
        }, 5);
    }

    public main(): void {
        // load app here..
    }

    protected onReady(f: () => void): void {
        if (document.readyState === "complete") {
            f();
            return;
        }
        document.addEventListener("readystatechange", (e) => {
            f();
        });
    }

}
