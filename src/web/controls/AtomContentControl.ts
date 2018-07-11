import { AtomBinder } from "../../core/AtomBinder";
import { AtomControl } from "./AtomControl";

export class AtomContentControl extends AtomControl {

    private mContent: AtomControl;
    public get content(): AtomControl {
        return this.mContent;
    }

    public set content(c: AtomControl) {
        const old = this.mContent;
        if (old) {
            old.element.remove();
        }
        this.mContent = c;
        if (c) {
            this.element.appendChild(c.element);
        }
        AtomBinder.refreshValue(this, "content");
    }
}
