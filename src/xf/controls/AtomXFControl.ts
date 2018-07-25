import { AtomBinder } from "../../core/AtomBinder";
import { AtomBridge } from "../../core/AtomBridge";
import { AtomComponent } from "../../core/AtomComponent";
import { IAtomElement } from "../../core/types";

export class AtomXFControl extends AtomComponent<IAtomElement, AtomXFControl> {

    public get parent(): AtomXFControl {
        return AtomBridge.instance.atomParent(this.element, true) as any;
    }

    public get templateParent(): AtomXFControl {
        return AtomBridge.instance.templateParent(this.element) as any;
    }

    public atomParent(e: IAtomElement): AtomXFControl {
        return AtomBridge.instance.atomParent(e, false) as any;
    }
    public attachControl(): void {
        AtomBridge.instance.attachControl(this.element, this as any);
    }

    public append(element: IAtomElement | AtomXFControl): AtomXFControl {
        return this;
    }

    protected refreshInherited(name: string, fx: (ac: AtomComponent<IAtomElement, AtomXFControl>) => boolean): void {
        AtomBinder.refreshValue(this, name);
        AtomBridge.instance.visitDescendents(this.element, (e, ac) => {
            if (ac) {
                ((ac as any) as AtomXFControl).refreshInherited(name, fx);
                return false;
            }
            return true;
        });
    }

    protected loadXaml(content: string): void {
        const bridge = AtomBridge.instance;
        bridge.loadContent(this.element, content);
    }

    protected find(name: string): any {
        return AtomBridge.instance.findChild(this.element, name);
    }

    protected createControl(name: string): any {
        return AtomBridge.instance.create(name);
    }
}
