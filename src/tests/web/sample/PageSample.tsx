import XNode from "../../../core/XNode.js";
import { AtomViewModel } from "../../../view-model/AtomViewModel.js";
import { AtomControl } from "../../../web/controls/AtomControl.js";
import { AtomListBox } from "../../../web/controls/AtomListBox.js";

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
