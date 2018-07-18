import { BindableProperty } from "../../core/BindableProperty";
import { AtomControl, IAtomControlElement } from "./AtomControl";

export class AtomViewStack extends AtomControl {

    @BindableProperty
    public selectedIndex: number;

    public children: HTMLElement[];

    public current: HTMLElement;

    public append(e: HTMLElement | Text | AtomControl): AtomControl {
        const ee = e instanceof AtomControl ? (e as AtomControl).element : e as HTMLElement;
        ((ee as any) as IAtomControlElement)._logicalParent = this.element as IAtomControlElement;
        this.children = this.children || [];
        this.children.push(e instanceof AtomControl ? (e as AtomControl).element : e as HTMLElement);
        if (this.selectedIndex === undefined) {
            this.selectedIndex = 0;
        }
        return this;
    }

    public onUpdateUI(): void {
        const e = this.children[this.selectedIndex];
        if (!e) {
            return;
        }

        if (this.current === e) {
            super.onUpdateUI();
            return;
        }

        this.current.remove();
        this.element.appendChild(e);
        this.current = e;
    }

}
