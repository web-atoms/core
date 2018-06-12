export class AtomDispatcher {

    public static instance: AtomDispatcher = new AtomDispatcher();
    public paused: boolean;
    public head = null;
    public tail = null;

    public  onTimeout(): void {
        if (this.paused) {
            return;
        }
        if (!this.head) {
            return;
        }
        const item = this.head;
        this.head = item.next;
        item.next = null;
        if (!this.head) {
            this.tail = null;
        }

        item();
        setTimeout(() => {
            this.onTimeout();
        }, 1);
    }

    public pause(): void {
        this.paused = true;
    }

    public start(): void {
        this.paused = false;
        setTimeout(() => {
            this.onTimeout();
        }, 1);
    }

    public callLater(f: () => void) {

        if (this.tail) {
            this.tail.next = f;
            this.tail = f;
        } else {

            this.head = f;
            this.tail = f;
        }
        if (!this.paused) {
            this.start();
        }
    }

}

AtomDispatcher.instance.start();
