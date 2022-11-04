import XNode from "../../../core/XNode";
import { AtomViewModel } from "../../../view-model/AtomViewModel";
import { AtomControl } from "../../../web/controls/AtomControl";
import { AtomListBox } from "../../../web/controls/AtomListBox";

class PageSampleViewModel extends AtomViewModel {}

export default class PageSample extends AtomControl {

    public viewModel: PageSampleViewModel;

    protected create() {
        super.create();

        this.renderer = <div data-layout="flex">
            <div style-position=""></div>
            <div>
                <a></a>
            </div>
            <AtomListBox
                data-layout="flex"        
                selectedIndex={3}        
                items={[2]}></AtomListBox>
        </div>;
    }

}
