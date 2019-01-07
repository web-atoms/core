import { IClassOf } from "../../core/types";
import { AtomControl } from "./AtomControl";

export class AtomTemplateControl extends AtomControl {

    public contentTemplate: IClassOf<AtomControl>;

    private content: AtomControl;

    public onPropertyChanged(name: string): void {
        if (name === "contentTemplate") {
            this.createContent();
        }
    }

    public onUpdateUI(): void {
        super.onUpdateUI();
        if (this.content) {
            return;
        }
        if (this.contentTemplate) {
            this.createContent();
        }
    }

    protected createContent(): void {
        const t = this.contentTemplate;
        if (!t) {
            return;
        }

        const tc = this.content;
        if (tc) {
            tc.dispose();
            this.content = null;
        }

        const ntc = this.content = new (t)(this.app);

        this.append(tc);
    }

}
