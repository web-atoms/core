import { AtomDisposable, IDisposable } from "../../core/types";
import { RegisterSingleton } from "../../di/RegisterSingleton";
import { ModuleFiles } from "../../ModuleFiles";
import { BusyIndicatorService } from "../../services/BusyIndicatorService";

@RegisterSingleton
export class WebBusyIndicatorService extends BusyIndicatorService {

    private zIndex: number = 50000;

    public createIndicator(): IDisposable {

        const div = document.createElement("div");

        const span = document.createElement("img");

        const divStyle = div.style;
        divStyle.position = "absolute";
        divStyle.left = divStyle.right = divStyle.bottom = divStyle.top = "0";
        divStyle.zIndex = (this.zIndex ++) + "";
        const spanStyle = span.style;
        spanStyle.position = "absolute";
        spanStyle.margin = "auto";
        spanStyle.width = "66px";
        spanStyle.height = "66px";
        span.src = ModuleFiles.src.web.images.busy_gif;

        div.appendChild(span);

        document.body.appendChild(div);
        return new AtomDisposable(() => {
            // dispose...
            div.remove();
        });
    }
}
