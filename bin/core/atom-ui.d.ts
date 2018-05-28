import { AtomControl } from "../controls/atom-control";
import { INameValues } from "./types";
export declare class AtomUI {
    atomParent(element: HTMLElement): AtomControl;
    /**
     * Don't use
     * @static
     * @param {HTMLElement} e
     * @returns {HTMLElement}
     * @memberof AtomUI
     */
    cloneNode(e: HTMLElement): HTMLElement;
    parseValue(val: string): (number | boolean | string);
    parseUrl(url: string): INameValues;
    childEnumerator(e: HTMLElement): Iterable<HTMLElement>;
    findPresenter(e: HTMLElement): HTMLElement;
    attr(arg0: any, arg1: any): any;
}
