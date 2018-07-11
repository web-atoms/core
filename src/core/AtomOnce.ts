/**
 * AtomOnce will execute given method only once and it will prevent recursive calls.
 * This is important when you want to update source and destination and prevent recursive calls.
 * @example
 *      private valueOnce: AtomOnce = new AtomOnce();
 *
 *      private onValueChanged(): void {
 *          valueOnce.run(()=> {
 *              this.value = compute(this.target);
 *          });
 *      }
 *
 *      private onTargetChanged(): void {
 *          valueOnce.run(() => {
 *              this.target = computeInverse(this.value);
 *          });
 *      }
 */
export class AtomOnce {

    private isRunning: boolean;
    /**
     * AtomOnce will execute given method only once and it will prevent recursive calls.
     * This is important when you want to update source and destination and prevent recursive calls.
     * @example
     *      private valueOnce: AtomOnce = new AtomOnce();
     *
     *      private onValueChanged(): void {
     *          valueOnce.run(()=> {
     *              this.value = compute(this.target);
     *          });
     *      }
     *
     *      private onTargetChanged(): void {
     *          valueOnce.run(() => {
     *              this.target = computeInverse(this.value);
     *          });
     *      }
     */
    public run(f: () => any): void {
        if (this.isRunning) {
            return;
        }
        let isAsync: boolean = false;
        try {
            this.isRunning = true;
            const p = f() as Promise<any>;
            if (p && p.then && p.catch) {
                isAsync = true;
                p.then(() => {
                    this.isRunning = false;
                }).catch(() => {
                    this.isRunning = false;
                });
            }
        } finally {
            if (!isAsync) {
                this.isRunning = false;
            }
        }
    }

}
