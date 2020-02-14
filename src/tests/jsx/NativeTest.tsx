import XNode from "../../core/XNode";
import { AtomXFControl } from "../../xf/controls/AtomXFControl";
import XF from "./NativeElement";

export default class NativeTest extends AtomXFControl {

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
