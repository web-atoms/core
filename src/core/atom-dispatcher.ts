import { AtomUI } from "./atom-ui";

import * as WebAtoms from "./types";

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
        window.setTimeout(this.onTimeout, 1);
    }

        let this = this;
        this.onTimeout() {
            _this.onTimeout();
        }

    public pause(): void {
        this.paused = true;
    }

    public start(): void {
        this.paused = false;
        window.setTimeout(this.onTimeout, 1);
    }

    public callLater(f: () => void) {
        // this.queue.push(fn);
        if (this.tail) {
            this.tail.next = f;
            this.tail = f;
        } else {
            // queue is empty..
            this.head = f;
            this.tail = f;
        }
        if (!this.paused) {
            this.start();
        }
    }

        public aggregateHandler(f, i) {
        function ah(fx) {
            this._handler = fx;

            const self = this;

            this.invoke =  () => {
                try {
                    self._handler.apply(self, self.args);
                } catch (e) {
                    if (console) {
                        // tslint:disable-next-line:no-console
                        console.log(e);
                    }
                } finally {
                    self.timeout = 0;
                    self.pending = false;
                }
            };

            this.handler =  () => {
                if (self.pending) {
                    return;
                }
                self.pending = true;
                self.args = arguments;
                if (self.timeout) {
                    clearTimeout(self.timeout);
                }
                self.timeout = setTimeout(self.invoke, i || 500);
            };
        }

        const n = new ah(f);
        return n.handler;
    }

}
