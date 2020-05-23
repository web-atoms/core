import Bind from "../../../core/Bind";
import XNode from "../../../core/XNode";
import { NavigationService } from "../../../services/NavigationService";
import { AtomControl } from "../../controls/AtomControl";

export default class WindowSample extends AtomControl {

    public create() {
        const ns = this.resolve(NavigationService);
        this.render(<div>
            <button eventClick={Bind.event(() => ns.alert("Alert"))} >Alert</button>
            <button eventClick={Bind.event(() => ns.confirm("Confirm"))} >Confirm</button>
        </div>);
    }

}
