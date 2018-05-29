import { IAtomElement, IDisposable } from "../core/types";
export declare class AtomControl {
    element: IAtomElement;
    private mData;
    data: any;
    private mViewModel;
    viewModel: any;
    private mLocalViewModel;
    localViewModel: any;
    readonly parent: AtomControl;
    readonly templateParent: AtomControl;
    private eventHandlers;
    private bindings;
    constructor(e: IAtomElement);
    bind(element: IAtomElement, name: string, path: string[], twoWays: boolean, valueFunc?: (v: any[]) => any): IDisposable;
    bindEvent(element: IAtomElement, name?: string, method?: EventListenerOrEventListenerObject, key?: string): void;
    unbindEvent(element: HTMLElement, name?: string, method?: EventListenerOrEventListenerObject, key?: string): void;
    hasProperty(name: string): boolean;
    setLocalValue(element: IAtomElement, name: string, value: any): void;
    dispose(e?: IAtomElement): void;
    append(element: IAtomElement | AtomControl): AtomControl;
    init(): void;
    private refreshInherited(name, fx);
}
