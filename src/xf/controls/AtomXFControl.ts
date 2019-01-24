import { AtomBinder } from "../../core/AtomBinder";
import { AtomBridge } from "../../core/AtomBridge";
import { AtomComponent } from "../../core/AtomComponent";
import { IAtomElement } from "../../core/types";
import { NavigationService } from "../../services/NavigationService";

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

    public dispose(e?: IAtomElement): void {
        const el = this.element;
        super.dispose(e);
        AtomBridge.instance.dispose(el);
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
        const bridge = AtomBridge.instance as any;
        bridge.loadXamlContent(this, this.element, content);
    }

    protected find(name: string): any {
        return AtomBridge.instance.findChild(this.element, name);
    }

    protected createControl(name: string): any {
        return AtomBridge.instance.create(name);
    }

    protected setTemplate(element: any, name: string, template: () => AtomXFControl): void {
        if (!template) {
            return;
        }
        AtomBridge.instance.setTemplate(element, name, template);
    }

    protected setImport(element: any, name: string, factory: () => AtomXFControl): void {
        if (!factory) {
            return;
        }
        AtomBridge.instance.setImport(element, name, factory);
    }

    protected setElementValue(element: any, name: string, value: any): void {
        if (/^event/.test(name)) {
            this.bindEvent(element, name.substr(5), async () => {
                try {
                    const p = value() as Promise<any>;
                    if (p) {
                        await p;
                    }
                } catch (e) {
                    if (/cancelled/i.test(e)) {
                        return;
                    }
                    const nav: NavigationService = this.app.resolve(NavigationService);
                    await nav.alert(e, "Error");
                }
            });
            return;
        }
        AtomBridge.instance.setValue(element, name, value);
    }

}
