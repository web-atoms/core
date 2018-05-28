import { IDisposable } from "./types";
/**
 *
 *
 * @export
 * @class AtomList
 * @extends {Array<T>}
 * @template T
 */
export declare class AtomList<T> extends Array<T> {
    next: (() => any);
    prev: (() => any);
    private startValue;
    private totalValue;
    private sizeValue;
    constructor();
    start: number;
    total: number;
    size: number;
    /**
     * Adds the item in the list and refresh bindings
     * @param {T} item
     * @returns {number}
     * @memberof AtomList
     */
    add(item: T): number;
    /**
     * Add given items in the list and refresh bindings
     * @param {Array<T>} items
     * @memberof AtomList
     */
    addAll(items: T[]): void;
    /**
     * Replaces list with given items, use this
     * to avoid flickering in screen
     * @param {T[]} items
     * @memberof AtomList
     */
    replace(items: T[], start?: number, size?: number): void;
    /**
     * Inserts given number in the list at position `i`
     * and refreshes the bindings.
     * @param {number} i
     * @param {T} item
     * @memberof AtomList
     */
    insert(i: number, item: T): void;
    /**
     * Removes item at given index i and refresh the bindings
     * @param {number} i
     * @memberof AtomList
     */
    removeAt(i: number): void;
    /**
     * Removes given item or removes all items that match
     * given lambda as true and refresh the bindings
     * @param {(T | ((i:T) => boolean))} item
     * @returns {boolean} `true` if any item was removed
     * @memberof AtomList
     */
    remove(item: T | ((i: T) => boolean)): boolean;
    /**
     * Removes all items from the list and refreshes the bindings
     * @memberof AtomList
     */
    clear(): void;
    refresh(): void;
    watch(f: () => void): IDisposable;
}
