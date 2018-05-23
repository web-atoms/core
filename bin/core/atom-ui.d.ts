import { NameValues } from "./types";
import { AtomControl } from "../controls/atom-control";
export declare class AtomUI {
    static atomParent(element: HTMLElement): AtomControl;
    /**
     * Don't use
     * @static
     * @param {HTMLElement} e
     * @returns {HTMLElement}
     * @memberof AtomUI
     */
    static cloneNode(e: HTMLElement): HTMLElement;
    static parseValue(val: string): (number | boolean | string);
    static parseUrl(url: string): NameValues;
}
