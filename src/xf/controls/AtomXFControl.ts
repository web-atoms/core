import { AtomBinder } from "../../core/AtomBinder";
import { AtomBridge } from "../../core/AtomBridge";
import { AtomComponent } from "../../core/AtomComponent";
import Bind from "../../core/Bind";
import { IAtomElement } from "../../core/types";
import XNode from "../../core/XNode";
import { NavigationService } from "../../services/NavigationService";

const bridge = AtomBridge.instance;

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

    protected render(node: XNode, e?: any): void {

        // element must be created before creating control
        // so in preCreate element should be available if
        // control wants to add default behavior

        // (this as any).element = bridge.createNode(this, node, Bind, XNode, AtomControl);

        function toTemplate(n: XNode) {
            const fx = typeof n.name === "function" ? n.name : AtomXFControl;
            const en = n.attributes && n.attributes.for ? n.attributes.for : undefined;
            return class Template extends (fx as any) {
                constructor(a, e1) {
                    super(a, e1 || (en ? bridge.create(en) : undefined));
                }
            };
        }

        e = e || this.element;
        const attr = node.attributes;
        if (attr) {
            for (const key in attr) {
                if (attr.hasOwnProperty(key)) {
                    const item = attr[key];
                    if (item instanceof Bind) {
                        item.setupFunction(key, item, this, e);
                    } else if (item instanceof XNode) {
                        // this is template..
                        this.setLocalValue(e, key, toTemplate(item));
                    } else {
                        this.setLocalValue(e, key, item);
                    }
                }
            }
        }

        for (const iterator of node.children) {
            if (typeof iterator === "string") {
                e.appendChild(document.createTextNode(iterator));
                continue;
            }
            const t = iterator.attributes && iterator.attributes.template;
            if (t) {
                this.setLocalValue(e, t, toTemplate(iterator.children[0] || {}));
                continue;
            }
            if (typeof iterator.name === "string") {
                const ex = bridge.create(iterator.name);
                if (this.element === e) {
                    this.append(ex);
                } else {
                    e.appendChild(ex);
                }
                this.render(iterator, ex);
                continue;
            }
            const fx = iterator.attributes ? iterator.attributes.for : undefined;
            const c = new (iterator.name)(this.app, fx) as AtomXFControl;
            if (this.element === e) {
                this.append(c);
                c.render(iterator, c.element);
            } else {
                e.appendChild(c.element);
                c.render(iterator, c.element);
            }
        }

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
