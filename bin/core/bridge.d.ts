import { AtomControl } from "../controls/atom-control";
import { IAtomElement, IDisposable } from "./types";
export declare abstract class BaseElementBridge<T extends IAtomElement> {
    abstract create(type: string): T;
    abstract attachControl(element: T, control: AtomControl): void;
    abstract addEventHandler(element: T, name: string, handler: EventListenerOrEventListenerObject, capture?: boolean): IDisposable;
    abstract atomParent(element: T, climbUp?: boolean): AtomControl;
    abstract elementParent(element: T): T;
    abstract templateParent(element: T): AtomControl;
    abstract visitDescendents(element: T, action: (e: T, ac: AtomControl) => boolean): void;
    abstract dispose(element: T): void;
    abstract appendChild(parent: T, child: T): void;
    abstract getValue(element: HTMLElement, name: string): any;
    abstract setValue(element: T, name: string, value: any): void;
    abstract watchProperty(element: T, name: string, f: (v: any) => void): IDisposable;
}
export declare class AtomElementBridge extends BaseElementBridge<HTMLElement> {
    addEventHandler(element: HTMLElement, name: string, handler: EventListenerOrEventListenerObject, capture?: boolean): IDisposable;
    atomParent(element: HTMLElement, climbUp?: boolean): AtomControl;
    elementParent(element: HTMLElement): HTMLElement;
    templateParent(element: HTMLElement): AtomControl;
    visitDescendents(element: HTMLElement, action: (e: HTMLElement, ac: AtomControl) => boolean): void;
    dispose(element: HTMLElement): void;
    appendChild(parent: HTMLElement, child: HTMLElement): void;
    setValue(element: HTMLElement, name: string, value: any): void;
    getValue(element: HTMLElement, name: string): any;
    watchProperty(element: HTMLElement, name: string, f: (v: any) => void): IDisposable;
    attachControl(element: HTMLElement, control: AtomControl): void;
    create(type: string): HTMLElement;
}
export declare class AtomBridge {
    static instance: BaseElementBridge<IAtomElement>;
    static create(name: string): IAtomElement;
}
