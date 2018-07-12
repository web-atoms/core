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
            const style = c.element.style;
            style.position = "absolute";
            style.top = style.left = style.right = style.bottom = "0";
            c.invalidate();
        }
        AtomBinder.refreshValue(this, "content");
    }
}
