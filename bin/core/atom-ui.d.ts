import { INameValues } from "./types";
export declare class AtomUI {
    static childEnumerator(e: HTMLElement): Iterable<HTMLElement>;
    /**
     * Don't use
     * @static
     * @param {HTMLElement} e
     * @returns {HTMLElement}
     * @memberof AtomUI
     */
    static cloneNode(e: HTMLElement): HTMLElement;
    static parseValue(val: string): (number | boolean | string);
    static parseUrl(url: string): INameValues;
    static findPresenter(e: HTMLElement): HTMLElement;
    static attr(arg0: any, arg1: any): any;
}
