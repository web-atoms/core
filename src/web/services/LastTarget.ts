import { descendentElementIterator } from "../core/AtomUI.js";

interface IElementTarget {
    target: WeakRef<HTMLElement>;
    previous: IElementTarget;
}


let current = null as IElementTarget;


export const LastTarget = {

    get target(): HTMLElement {
        for(;;) {
            if(!current?.target) {
                break;
            }
            const { target, previous } = current;
            const t = target.deref();
            if(t?.isConnected) {
                return t;
            }
            if(!previous) {
                break;
            }
            current = previous;
        }
        // get first AtomControl
        for(const i of descendentElementIterator(document.body)) {
            if ((i as HTMLElement).atomControl) {
                this.target = i;
                return i as HTMLElement;
            }
        }
    },
    set target(target: HTMLElement) {
        current = {
            target: new WeakRef(target),
            previous: current
        };
    }


};