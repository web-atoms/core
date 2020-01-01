import { AtomBinder } from "../../core/AtomBinder";
import { AtomBridge, BaseElementBridge } from "../../core/AtomBridge";
import { AtomComponent } from "../../core/AtomComponent";
import Bind from "../../core/Bind";
import { IAtomElement } from "../../core/types";
import XNode from "../../core/XNode";
import { NavigationService } from "../../services/NavigationService";

declare var bridge: BaseElementBridge<IAtomElement>;

declare var UMD: any;

UMD.defaultApp = "@web-atoms/core/dist/xf/XFApp";
UMD.viewPrefix = "xf";

export class AtomXFControl extends AtomComponent<IAtomElement, AtomXFControl> {

    public get parent(): AtomXFControl {
        return bridge.atomParent(this.element, true) as any;
    }

    // public get templateParent(): AtomXFControl {
    //     return bridge.templateParent(this.element) as any;
    // }

    public atomParent(e: IAtomElement): AtomXFControl {
        return bridge.atomParent(e, false) as any;
    }

    public append(element: IAtomElement | AtomXFControl): AtomXFControl {
        return this;
    }

    public dispose(e?: IAtomElement): void {
        const el = this.element;
        super.dispose(e);
        bridge.dispose(el);
    }

    public invokeEvent(event: { type: string, detail?: any }): void {
        (bridge as any).invokeEvent(this.element, event.type, event);
    }

    // protected refreshInherited(name: string, fx: (ac: AtomComponent<IAtomElement, AtomXFControl>) => boolean): void {
    //     AtomBinder.refreshValue(this, name);
    //     bridge.visitDescendents(this.element, (e, ac) => {
    //         if (ac) {
    //             ((ac as any) as AtomXFControl).refreshInherited(name, fx);
    //             return false;
    //         }
    //         return true;
    //     });
    // }

    protected loadXaml(content: string): void {
        (bridge as any).loadXamlContent(this, this.element, content);
    }

    protected find(name: string): any {
        return bridge.findChild(this.element, name);
    }

    protected createControl(name: string): any {
        return bridge.create(name);
    }

    protected setTemplate(element: any, name: string, template: () => AtomXFControl): void {
        if (!template) {
            return;
        }
        bridge.setTemplate(element, name, template);
    }

    protected setImport(element: any, name: string, factory: () => AtomXFControl): void {
        if (!factory) {
            return;
        }
        bridge.setImport(element, name, factory);
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
        bridge.setValue(element, name, value);
    }

}

bridge.controlFactory = AtomXFControl;
