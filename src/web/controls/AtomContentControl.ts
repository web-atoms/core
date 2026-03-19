import { AtomBinder } from "../../core/AtomBinder.js";
import { AtomStyle } from "../styles/AtomStyle.js";
import { IStyleDeclaration } from "../styles/IStyleDeclaration.js";
import { AtomControl } from "./AtomControl.js";

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
            c.invalidate();
        }
        AtomBinder.refreshValue(this, "content");
    }

    protected preCreate(): void {
        super.preCreate();
        this.defaultControlStyle = AtomContentStyle;
        this.runAfterInit(() => {
            this.element.classList.add(this.controlStyle.name);
        });
    }
}

export class AtomContentStyle extends AtomStyle {

    public get root(): IStyleDeclaration {
        return {
            subclasses: {
                " > *": {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                }
            }
        };
    }

}
