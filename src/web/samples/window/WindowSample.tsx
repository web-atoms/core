import Bind from "../../../core/Bind.js";
import XNode from "../../../core/XNode.js";
import { NavigationService } from "../../../services/NavigationService.js";
import { AtomControl } from "../../controls/AtomControl.js";

export default class WindowSample extends AtomControl {

    public create() {
        const ns = this.resolve(NavigationService);
        this.render(<div>
            <button eventClick={Bind.event(() => ns.alert("Alert"))} >Alert</button>
            <button eventClick={Bind.event(() => ns.confirm("Confirm"))} >Confirm</button>
        </div>);
    }

}
