import XNode from "../../core/XNode";
import { AtomControl } from "../../web/controls/AtomControl";
import XF from "./NativeElement";

export default class NativeTest extends AtomControl {

    public create() {
        this.render(<XF.NativeElement
            fontFamily="a"
            eventClick={null}>
            <XF.Grid>
                <XF.NativeElement
                    { ... XF.Grid.row(3) }
                    ></XF.NativeElement>
            </XF.Grid>
            <XF.NativeElement.itemTemplate>
                <XF.DataTemplate>
                    <XF.NativeElement></XF.NativeElement>
                </XF.DataTemplate>
            </XF.NativeElement.itemTemplate>
        </XF.NativeElement>);
    }

}
