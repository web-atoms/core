import { AtomBinder } from "../../core/AtomBinder";
import { AtomBridge, BaseElementBridge } from "../../core/AtomBridge";
import { AtomComponent } from "../../core/AtomComponent";
import Bind from "../../core/Bind";
import { IAtomElement } from "../../core/types";
import XNode from "../../core/XNode";
import { TypeKey } from "../../di/TypeKey";
import { NavigationService } from "../../services/NavigationService";
import { AtomStyle } from "../../web/styles/AtomStyle";
import { AtomStyleSheet } from "../../web/styles/AtomStyleSheet";

declare var UMD: any;

UMD.defaultApp = "@web-atoms/core/dist/xf/XFApp";
UMD.viewPrefix = "xf";
AtomBridge.platform = "xf";

const defaultStyleSheets: { [key: string]: AtomStyle } = {};

export class AtomXFControl extends AtomComponent<IAtomElement, AtomXFControl> {

    public defaultControlStyle: any;

    private mControlStyle: AtomStyle;
    public get controlStyle(): AtomStyle {
        if (this.mControlStyle === undefined) {
            const key = TypeKey.get(this.defaultControlStyle || this.constructor);

            this.mControlStyle = defaultStyleSheets[key];
            if (this.mControlStyle) {
                return this.mControlStyle;
            }

            if (this.defaultControlStyle) {
                this.mControlStyle = defaultStyleSheets[key] ||
                ( defaultStyleSheets[key] = this.theme.createNamedStyle(this.defaultControlStyle, key, 0));
            }
            this.mControlStyle = this.mControlStyle || null;
        }
        return this.mControlStyle;
    }

    public set controlStyle(v: AtomStyle) {
        if (v instanceof AtomStyle) {
            this.mControlStyle = v;
        } else {
            const key = TypeKey.get(v);
            this.mControlStyle = defaultStyleSheets[key] ||
            ( defaultStyleSheets[key] = this.theme.createNamedStyle(v, key, 0));
        }
        AtomBinder.refreshValue(this, "controlStyle");
        // this.invalidate();
    }

    public get theme(): AtomStyleSheet {
        return this.mTheme ||
            this.mCachedTheme ||
            (this.mCachedTheme = (this.parent ? this.parent.theme : this.app.resolve(AtomStyleSheet, false, null) ));
    }

    public get parent(): AtomXFControl {
        return AtomBridge.instance.atomParent(this.element, true) as any;
    }

    private mTheme: AtomStyleSheet;
    private mCachedTheme: AtomStyleSheet;

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

    public loadXaml(text: string) {
        (AtomBridge.instance as any).loadXaml(this.element, text);
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
                    if (/canceled|cancelled/i.test(e)) {
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

// add custom event...

declare var global;

global.CustomEvent = function(type: string, { detail }) {
    this.type = type;
    this.detail = detail;
};
