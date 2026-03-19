import { AtomBinder } from "../../core/AtomBinder.js";
import { AtomLoader } from "../../core/AtomLoader.js";
import { AtomUri } from "../../core/AtomUri.js";
import { BindableProperty } from "../../core/BindableProperty.js";
import { IClassOf } from "../../core/types.js";
import { JsonService } from "../../services/JsonService.js";
import { AtomContentControl } from "./AtomContentControl.js";
import { AtomControl } from "./AtomControl.js";
import { AtomItemsControl } from "./AtomItemsControl.js";

export class AtomViewPager extends AtomItemsControl {

    public dispose(e?: HTMLElement): void {
        if (!e) {
            for (const iterator of this.items) {
                iterator.dispose();
            }
        }
        this.selectedItem = null;
        super.dispose(e);
    }

    public onCollectionChanged(): void {
        // do nothing...
    }

    protected create(): void {
        super.create();

        const eStyle = this.element.style;
        eStyle.position = "absolute";
        eStyle.left = eStyle.right = eStyle.bottom = eStyle.top = "0";

        const cc = new AtomContentControl(this.app);
        this.append(cc);
        const style = cc.element.style;
        style.position = "absolute";
        style.top = style.left = style.right = style.bottom = "0";

        cc.bind(cc.element, "content", [["this", "selectedItem"]], false, (si) => {
            if (!si) {
                return undefined;
            }
            if (si.view) {
                return si.view;
            }
            this.app.runAsync( async () => {
                const { view: ctrl } = await AtomLoader.loadView<AtomControl>(new AtomUri(si.value), this.app, false);
                si.view = ctrl;
                ctrl.element._logicalParent = this.element;
                AtomBinder.refreshValue(this, "selectedItem");
                si.dispose = () => {
                    ctrl.dispose();
                    ctrl.element._logicalParent = null;
                };
            });
            return undefined;
        }, this);
    }
}
