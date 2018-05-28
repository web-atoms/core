import { Atom } from "../atom";
import { AtomControl } from "../controls/atom-control";
import { AtomComponent } from "./atom-component";
import { AtomUI } from "./atom-ui";
import { AtomDisposable, IAtomElement, IDisposable, INameValuePairs, INativeComponent } from "./types";

export abstract class BaseElementBridge<T extends IAtomElement> {

    public abstract addEventHandler(
        element: T,
        name: string,
        handler: EventListenerOrEventListenerObject,
        capture?: boolean): IDisposable;

    public abstract atomParent(element: T, climbUp?: boolean): AtomControl;

    public abstract elementParent(element: T): T;

    public abstract templateParent(element: T): AtomControl;

    public abstract visitDescendents(element: T, action: (e: T, ac: AtomControl) => boolean): void;

    public abstract dispose(element: T): void;

}

export class AtomElementBridge extends BaseElementBridge<HTMLElement> {

    public addEventHandler(
        element: HTMLElement,
        name: string,
        handler: EventListenerOrEventListenerObject,
        capture?: boolean): IDisposable {
            element.addEventListener(name, handler, capture);
            return new AtomDisposable(() => {
                element.removeEventListener(name, handler, capture);
            });
        }

        public atomParent(element: HTMLElement, climbUp: boolean = true): AtomControl {
            const eany: INameValuePairs = element as INameValuePairs;
            if (eany.atomControl) {
                return eany.atomControl;
            }
            if (!climbUp) {
                return null;
            }
            if (!element.parentNode) {
                return null;
            }
            return this.atomParent(this.elementParent(element));
    }

    public elementParent(element: HTMLElement): HTMLElement {
        const eany = element as any;
        const lp = eany._logicalParent;
        if (lp) {
            return lp;
        }
        return element.parentElement;
    }

    public templateParent(element: HTMLElement): AtomControl {
        if (!element) {
            return null;
        }
        const eany = element as any;
        if (eany._templateParent) {
            return this.atomParent(element);
        }
        const parent = this.elementParent(element);
        if (!parent) {
            return null;
        }
        return this.templateParent(parent);
    }

    public visitDescendents(element: HTMLElement, action: (e: HTMLElement, ac: AtomControl) => boolean): void  {

        for (const iterator of AtomUI.childEnumerator(element)) {

            const eany = iterator as any;
            const ac = eany ? eany.atomControl : undefined;

            if (!action(iterator, ac)) {
                continue;
            }
            this.visitDescendents(iterator, action);
        }
    }

    public dispose(element: HTMLElement): void {
        const eany = element as any;
        eany.atomControl = undefined;
        delete eany.atomControl;
    }
}

export class AtomBridge {

    public static instance: BaseElementBridge<IAtomElement> = new AtomElementBridge();

}
