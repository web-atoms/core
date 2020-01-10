import { AtomBinder } from "../../core/AtomBinder";
import { AtomBridge, BaseElementBridge } from "../../core/AtomBridge";
import { AtomComponent } from "../../core/AtomComponent";
import Bind from "../../core/Bind";
import { IAtomElement } from "../../core/types";
import XNode from "../../core/XNode";
import { NavigationService } from "../../services/NavigationService";

declare var UMD: any;

UMD.defaultApp = "@web-atoms/core/dist/xf/XFApp";
UMD.viewPrefix = "xf";

export class AtomXFControl extends AtomComponent<IAtomElement, AtomXFControl> {

    public get parent(): AtomXFControl {
        return AtomBridge.instance.atomParent(this.element, true) as any;
    }

    public atomParent(e: IAtomElement): AtomXFControl {
        return AtomBridge.instance.atomParent(e, false) as any;
    }

    public append(element: any): AtomXFControl {
        this.element.appendChild(element.element || element);
        return this;
    }

    public dispose(e?: IAtomElement): void {
        const el = this.element;
        super.dispose(e);
        AtomBridge.instance.dispose(el);
    }

    public invokeEvent(event: { type: string, detail?: any }): void {
        (AtomBridge.instance as any).invokeEvent(this.element, event.type, event);
    }

    public staticResource(name: string) {
        return (AtomBridge.instance as any).getStaticResource(this.element, name);
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
declare var bridge;
bridge.controlFactory = AtomXFControl;
