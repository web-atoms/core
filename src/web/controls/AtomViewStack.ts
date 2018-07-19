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
        const index = this.children.length;
        this.children.push(e instanceof AtomControl ? (e as AtomControl).element : e as HTMLElement);
        if (this.selectedIndex === undefined) {
            this.selectedIndex = 0;
        }

        const style = ee.style;
        style.position = "absolulte";
        style.top = style.left = style.right = style.bottom = "0";

        this.bind(ee, "styleVisibility", [["selectedIndex"]], false, (v) => v === index ? "visibile" : "hidden" );

        this.element.appendChild(ee);
        return this;
    }

}
