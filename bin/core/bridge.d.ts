import { AtomControl } from "../controls/atom-control";
import { IAtomElement, IDisposable } from "./types";
export declare abstract class BaseElementBridge<T extends IAtomElement> {
    abstract addEventHandler(element: T, name: string, handler: EventListenerOrEventListenerObject, capture?: boolean): IDisposable;
    abstract atomParent(element: T, climbUp?: boolean): AtomControl;
    abstract elementParent(element: T): T;
    abstract templateParent(element: T): AtomControl;
    abstract visitDescendents(element: T, action: (e: T, ac: AtomControl) => boolean): void;
    abstract dispose(element: T): void;
}
export declare class AtomElementBridge extends BaseElementBridge<HTMLElement> {
    addEventHandler(element: HTMLElement, name: string, handler: EventListenerOrEventListenerObject, capture?: boolean): IDisposable;
    atomParent(element: HTMLElement, climbUp?: boolean): AtomControl;
    elementParent(element: HTMLElement): HTMLElement;
    templateParent(element: HTMLElement): AtomControl;
    visitDescendents(element: HTMLElement, action: (e: HTMLElement, ac: AtomControl) => boolean): void;
    dispose(element: HTMLElement): void;
}
export declare class AtomBridge {
    static instance: BaseElementBridge<IAtomElement>;
}
