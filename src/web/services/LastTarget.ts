import { descendentElementIterator } from "../core/AtomUI";

interface IElementTarget {
    target: HTMLElement;
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
            if(target.isConnected) {
                return target;
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
            target,
            previous: current
        };
    }


};