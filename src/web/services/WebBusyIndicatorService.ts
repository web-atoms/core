import { App } from "../../App";
import { IDisposable } from "../../core/types";
import { Inject } from "../../di/Inject";
import { RegisterSingleton } from "../../di/RegisterSingleton";
import { BusyIndicatorService } from "../../services/BusyIndicatorService";
import { NavigationService } from "../../services/NavigationService";
import { AtomControl } from "../controls/AtomControl";
import { cssNumberToString } from "../styles/StyleBuilder";
import { WindowService } from "./WindowService";

@RegisterSingleton
export class WebBusyIndicatorService extends BusyIndicatorService {

    @Inject
    private navigationService: NavigationService;

    @Inject
    private app: App;

    private zIndex: number = 50000;

    private indicators: number = 0;

    public createIndicator(): IDisposable {

        const host = document.createElement("div");
        const popup = new AtomControl(this.app, host);
        host.className = "indicator-host";

        const span = document.createElement("i");

        const divStyle = host.style;
        divStyle.position = "absolute";
        divStyle.overflow = "hidden";
        divStyle.left = divStyle.right = divStyle.bottom = divStyle.top = "0";
        divStyle.zIndex = (this.zIndex ++) + "";
        const spanStyle = span.style;
        spanStyle.position = "absolute";
        spanStyle.margin = "auto";
        spanStyle.width = "16px";
        spanStyle.height = "16px";
        spanStyle.overflow = "hidden";
        spanStyle.maxHeight = "100%";
        spanStyle.maxWidth = "100%";
        spanStyle.left = spanStyle.right = spanStyle.bottom = spanStyle.top = "0";
        // span.src = ModuleFiles.src.web.images.busy_gif;
        span.className = "fas fa-spinner fa-spin";

        host.appendChild(span);

        const ws = this.navigationService as WindowService;

        const e = ws.getHostForElement();

        if (e) {
            e.appendChild(host);

        } else {
            document.body.appendChild(host);
            ws.refreshScreen();
            popup.bind(host, "styleLeft", [["this", "scrollLeft"]], false, cssNumberToString, ws.screen);
            popup.bind(host, "styleTop", [["this", "scrollTop"]], false, cssNumberToString, ws.screen);
            popup.bind(host, "styleWidth", [["this", "width"]], false, cssNumberToString, ws.screen);
            popup.bind(host, "styleHeight", [["this", "height"]], false, cssNumberToString, ws.screen);
        }

        popup.registerDisposable({
            dispose: () => {
                host.remove();
            }
        });

        return popup;
    }
}
