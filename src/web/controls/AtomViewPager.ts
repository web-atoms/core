import { AtomBinder } from "../../core/AtomBinder";
import { AtomUri } from "../../core/AtomUri";
import { BindableProperty } from "../../core/BindableProperty";
import { IClassOf } from "../../core/types";
import { JsonService } from "../../services/JsonService";
import { AtomViewLoader } from "../AtomViewLoader";
import { AtomContentControl } from "./AtomContentControl";
import { AtomControl } from "./AtomControl";
import { AtomItemsControl } from "./AtomItemsControl";

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

        const estyle = this.element.style;
        estyle.position = "absolute";
        estyle.left = estyle.right = estyle.bottom = estyle.top = "0";

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
                const ctrl = await AtomViewLoader.loadView(new AtomUri(si.value), this.app);
                si.view = ctrl;
                AtomBinder.refreshValue(this, "selectedItem");
            });
            return undefined;
        }, this);
    }
}
