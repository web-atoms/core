import { AtomBinder, IWatchableObject, IWatchFunctionCollection, WatchFunction } from "./AtomBinder";
import { IDisposable } from "./types";

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
        // private version: number = 1;
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
            // this.version++;
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
            // this.version++;
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
         * Replaces given item in the list at position `i`
         * and refreshes the bindings.
         * @param {number} i
         * @param {T} item
         * @memberof AtomList
         */
        public set(i: number, item: T): void {
            const old = this[i];
            this[i] = item;
            AtomBinder.invokeItemsEvent(this, "replace", i, item, old);
            AtomBinder.refreshValue(this, "length");
        }

        /**
         * Removes item at given index i and refresh the bindings
         * @param {number} i
         * @memberof AtomList
         */
        public removeAt(i: number): T {
            const item: T = this[i];
            this.splice(i, 1);
            AtomBinder.invokeItemsEvent(this, "remove", i, item);
            AtomBinder.refreshValue(this, "length");
            return item;
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
                        continue;
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
            // this.version++;
        }

        public watch(
            f: (target: any, key: string, index?: number, item?: any) => void,
            wrap?: boolean
        ): IDisposable {
            if (wrap) {
                const fx = f;
                f = (function() {
                    const p: any[] = [];
                    // tslint:disable-next-line:prefer-for-of
                    for (let i: number = 0; i < arguments.length ; i++) {
                        const iterator = arguments[i];
                        p.push(iterator);
                    }
                    return fx.call(this, p);
                });
            }
            return AtomBinder.add_CollectionChanged(this, f);
        }

        public count(f: (item) => boolean) {
            let total = 0;
            for (const iterator of this) {
                if (f(iterator)) {
                    total++;
                }
            }
            return total;
        }

        public avg(f: (item) => number) {
            if (!this.length) {
                return 0;
            }
            let sum = 0;
            for (const iterator of this) {
                sum += f(iterator);
            }
            return sum / this.length;
        }

        public includes(item) {
            return this.indexOf(item) !== -1;
        }

    }

    // tslint:disable
    const ap = Array.prototype;
    for (const key in AtomList.prototype) {
        if (Object.prototype.hasOwnProperty.call(AtomList.prototype, key)) {
            switch(key) {
                case "add":
                case "addAll":
                case "clear":
                case "refresh":
                case "set":
                case "remove":
                case "removeAt":
                case "watch":
                case "replace":
                case "insert":
                case "count":
                case "avg":
                case "includes":
                    if (key in ap) {
                        continue;
                    }
                    const element = AtomList.prototype[key];
                    Object.defineProperty(ap, key, {
                        enumerable: false,
                        value: element,
                        configurable: true,
                        writable: true
                    });
                    continue;
            }
        }
    }
    // Array.prototype["add"] = AtomList.prototype.add;
    // Array.prototype["addAll"] = AtomList.prototype.addAll;
    // Array.prototype["clear"] = AtomList.prototype.clear;
    // Array.prototype["refresh"] = AtomList.prototype.refresh;
    // Array.prototype["set"] = AtomList.prototype.set;
    // Array.prototype["remove"] = AtomList.prototype.remove;
    // Array.prototype["removeAt"] = AtomList.prototype.removeAt;
    // Array.prototype["watch"] = AtomList.prototype.watch;
    // Array.prototype["replace"] = AtomList.prototype.replace;
    // Array.prototype["insert"] = AtomList.prototype.insert;
    // Array.prototype["count"] = AtomList.prototype.count;
    // Array.prototype["avg"] = AtomList.prototype.avg;
    // Array.prototype["includes"] = AtomList.prototype.includes;

declare global { 
    interface Array<T> {
        add?(item:T):number;
        addAll?(item:T[]):void;
        clear?():void;
        refresh?():void;
        insert?(index: number, item: T): void;
        remove?(item: T | ((i:T) => boolean)):boolean;
        removeAt?(i: number):T;
        set?(index: number, item: T): void;
        watch?(
            f: (target: any, key: string, index?: number, item?: any) => void,
            wrap?: boolean): IDisposable;
        replace(items: T[], start?: number, size?: number): void;
        includes(item:T): boolean;
        count?(f: (item: T) => boolean): number;
        avg?(f: (item: T) => number): number;
    }
}