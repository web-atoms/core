import { AtomControl } from "../web/controls/AtomControl";
import { AtomListBox } from "../web/controls/AtomListBox";

export default function ExtendControl<T extends typeof AtomControl>(ctrl: T): T & { prototype: { init(): any; } } {

    // @ts-expect-error
    abstract class ExtendedControl extends (ctrl as any as T) {
        constructor(app, e = document.createElement("div")) {
            super(app, e);
            this.runAfterInit(() => this.app.runAsync(() => this.init()));
        }

        abstract init(): Promise<any>;
    }
    return ExtendedControl as any;
}

export class A extends ExtendControl(AtomListBox) {

    init() {
        
    }
    
}