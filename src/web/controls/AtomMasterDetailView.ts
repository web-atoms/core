import { BindableProperty } from "../../core/BindableProperty";
import { IClassOf } from "../../core/types";
import { AtomControl } from "./AtomControl";
import { AtomGridView } from "./AtomGridView";

export class AtomMasterDetailView extends AtomGridView {

    @BindableProperty
    public menu: IClassOf<AtomControl>;

    @BindableProperty
    public menuCollapsed: IClassOf<AtomControl> | string;

    @BindableProperty
    public detail: IClassOf<AtomControl>;

    @BindableProperty
    public sidebar: IClassOf<AtomControl>;

    @BindableProperty
    public sidebarCollapsed: IClassOf<AtomControl> | string;

    @BindableProperty
    public header: IClassOf<AtomControl>;

    @BindableProperty
    public headerCollapsed: IClassOf<AtomControl> | string;

    @BindableProperty
    public footer: IClassOf<AtomControl>;

    @BindableProperty
    public footerCollapsed: IClassOf<AtomControl> | string;

    public onUpdateUI(): void {
        this.removeAllChildren(this.element);

        
    }

    protected preCreate(): void {
        this.columns = "";
        this.rows = "";
    }

}
