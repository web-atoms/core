import { AtomBridge } from "../../core/AtomBridge";
import { IDisposable } from "../../core/types";
import { RegisterSingleton } from "../../di/RegisterSingleton";
import { BusyIndicatorService } from "../../services/BusyIndicatorService";

@RegisterSingleton
export default class XFBusyIndicatorService extends BusyIndicatorService {

    public createIndicator(): IDisposable {
        const popup = AtomBridge.instance.createBusyIndicator();
        return {
            dispose: () => {
                popup.dispose();
            }
        };
    }

}
