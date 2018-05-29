import { INameValues } from "./types";
export declare class AtomUI {
    static index: number;
    static childEnumerator(e: HTMLElement): Iterable<HTMLElement>;
    static parseUrl(url: string): INameValues;
    static parseValue(val: string): (number | boolean | string);
    static assignID(element: HTMLElement): string;
    static toNumber(text: string): number;
    static getNewIndex(): number;
}
