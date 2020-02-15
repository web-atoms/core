import XNode from "../../core/XNode";
import { AtomControl } from "../../web/controls/AtomControl";
import XF from "./NativeElement";

export default class NativeTest extends AtomControl {

    public create() {
        this.render(<XF.NativeElement
            fontFamily="a"
            eventClick={null}>
            <XF.NativeElement.itemTemplate>
                <XF.DataTemplate>
                    <XF.NativeElement></XF.NativeElement>
                </XF.DataTemplate>
            </XF.NativeElement.itemTemplate>
        </XF.NativeElement>);
    }

}
