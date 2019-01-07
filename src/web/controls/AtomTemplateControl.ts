import { IClassOf } from "../../core/types";
import { AtomControl } from "./AtomControl";

export class AtomTemplateControl extends AtomControl {

    public template: IClassOf<AtomControl>;

    private templateContent: AtomControl;

    public onPropertyChanged(name: string): void {
        if (name === "template") {
            this.createContent();
        }
    }

    protected createContent(): void {
        const t = this.template;
        if (!t) {
            return;
        }

        const tc = this.templateContent;
        if (tc) {
            tc.dispose();
            this.templateContent = null;
        }

        const ntc = this.templateContent = new (t)(this.app);

        this.append(tc);
    }

}
