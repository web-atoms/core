import { AtomBinder, IWatchableObject, IWatchFunctionCollection } from "./AtomBinder";
import { AtomDisposable, IDisposable } from "./types";

    /**
     *
     *
     * @export
     * @class AtomList
     * @extends {Array<T>}
     * @template T
     */
    export class AtomList<T> extends Array<T> {
        // public next: Function;
        // public prev: Function;
        public next: (() => any);
        public prev: (() => any);

        private startValue: number = 0;
        private totalValue: number = 0;
        private sizeValue: number = 10;
        constructor() {
            super();

            // tslint:disable-next-line
            this["__proto__"] = AtomList.prototype;

            this.next = () => {
                this.start = this.start + this.size;
            };

            this.prev = () => {
                if (this.start >= this.size) {
                    this.start = this.start - this.size;
                }
            };
        }
        public get start(): number {
            return this.startValue;
        }
        public set start(v: number) {
            if (v === this.startValue) {
                return ;
            }
            this.startValue = v;
            AtomBinder.refreshValue(this, "start");
        }

        public get total(): number {
            return this.totalValue;
        }
        public set total(v: number) {
            if (v === this.totalValue) {
                return ;
            }
            this.totalValue = v;
            AtomBinder.refreshValue(this, "total");
        }

        public get size(): number {
            return this.sizeValue;
        }
        public set size(v: number) {
            if (v === this.sizeValue) {
                return ;
            }
            this.sizeValue = v;
            AtomBinder.refreshValue(this, "size");
        }
        /**
         * Adds the item in the list and refresh bindings
         * @param {T} item
         * @returns {number}
         * @memberof AtomList
         */
        public add(item: T): number {
            const i: number = this.length;
            const n: number = this.push(item);
            AtomBinder.invokeItemsEvent(this, "add", i, item);
            AtomBinder.refreshValue(this, "length");
            return n;
        }

        /**
         * Add given items in the list and refresh bindings
         * @param {Array<T>} items
         * @memberof AtomList
         */
        public addAll(items: T[]): void {
            for (const item of items) {
                const i: number = this.length;
                this.push(item);
                AtomBinder.invokeItemsEvent(this, "add", i, item);
                AtomBinder.refreshValue(this, "length");
            }
            // tslint:disable-next-line:no-string-literal
            const t: number = items["total"];
            if (t) {
                this.total = t;
            }
        }

        /**
         * Replaces list with given items, use this
         * to avoid flickering in screen
         * @param {T[]} items
         * @memberof AtomList
         */
        public replace(items: T[], start?: number, size?: number): void {
            this.length = items.length;
            for (let i: number = 0; i < items.length; i++) {
                this[i] = items[i];
            }
            this.refresh();
            // tslint:disable-next-line:no-string-literal
            const t: number = items["total"];
            if (t) {
                this.total = t;
            }
            if (start !== undefined) {
                this.start = start;
            }
            if (size !== undefined) {
                this.size = size;
            }
        }

        /**
         * Inserts given number in the list at position `i`
         * and refreshes the bindings.
         * @param {number} i
         * @param {T} item
         * @memberof AtomList
         */
        public insert(i: number, item: T): void {
            const n: any = this.splice(i, 0, item);
            AtomBinder.invokeItemsEvent(this, "add", i, item);
            AtomBinder.refreshValue(this, "length");
        }

        /**
         * Removes item at given index i and refresh the bindings
         * @param {number} i
         * @memberof AtomList
         */
        public removeAt(i: number): void {
            const item: T = this[i];
            this.splice(i, 1);
            AtomBinder.invokeItemsEvent(this, "remove", i, item);
            AtomBinder.refreshValue(this, "length");
        }

        /**
         * Removes given item or removes all items that match
         * given lambda as true and refresh the bindings
         * @param {(T | ((i:T) => boolean))} item
         * @returns {boolean} `true` if any item was removed
         * @memberof AtomList
         */
        public remove(item: T | ((i: T) => boolean)): boolean {

            if (item instanceof Function) {
                let index: number = 0;
                let removed: boolean = false;
                for (const it of this) {
                    if (item(it)) {
                        this.removeAt(index);
                        removed = true;
                    }
                    index++;
                }
                return removed;
            }

            const n: number = this.indexOf(item);
            if (n !== -1) {
                this.removeAt(n);
                return true;
            }
            return false;
        }

        /**
         * Removes all items from the list and refreshes the bindings
         * @memberof AtomList
         */
        public clear(): void {
            this.length = 0;
            this.refresh();
        }

        public refresh(): void {
            AtomBinder.invokeItemsEvent(this, "refresh", -1, null);
            AtomBinder.refreshValue(this, "length");
        }

        public watch(f: () => void): IDisposable {
            AtomBinder.add_CollectionChanged(this, f);
            return new AtomDisposable(() => {
                AtomBinder.remove_CollectionChanged(this, f);
            });
        }

    }

    // tslint:disable
    Array.prototype["add"] = AtomList.prototype.add;
    Array.prototype["addAll"] = AtomList.prototype.addAll;
    Array.prototype["clear"] = AtomList.prototype.clear;
    Array.prototype["refresh"] = AtomList.prototype.refresh;
    Array.prototype["remove"] = AtomList.prototype.remove;
    Array.prototype["removeAt"] = AtomList.prototype.removeAt;
    Array.prototype["watch"] = AtomList.prototype.watch;

declare global { 
    interface Array<T> {
        add?(item:T):number;
        addAll?(item:T[]):void;
        clear?():void;
        refresh?():void;
        remove?(item: T | ((i:T) => boolean)):boolean;
        removeAt?(i: number):void;
        watch?(f:()=>void): IDisposable;
    }
}