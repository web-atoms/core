import Colors from "../../core/Colors";
import DISingleton from "../../di/DISingleton";
import { AtomControl } from "../controls/AtomControl";
import { AtomStyle } from "../styles/AtomStyle";
import { IStyleDeclaration } from "../styles/IStyleDeclaration";

const containerKey = Symbol("popupContainer");

export class PopupStyle extends AtomStyle {
    public get root(): IStyleDeclaration {
        return {
            padding: "5px",
            backgroundColor: Colors.white,
            border: "solid 1px lightgray",
            borderRadius: "5px",
            boxShadow: "rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;",
            display: "inline-block"
        };
    }
}

class PopupContainer extends AtomControl {

    public preCreate() {
        super.preCreate();
        this.defaultControlStyle = PopupStyle;

        this.runAfterInit(() => {
            this.element.classList.add(this.controlStyle.name);
        });
    }

}

@DISingleton({})
export default class PopupService {

    public show(opener: HTMLElement, popup: AtomControl, popupStyle?: PopupStyle) {
        const container = new PopupContainer(popup.app);
        if (popupStyle) {
            container.controlStyle = popupStyle;
        }
        container.element.appendChild(popup.element);
        popup[containerKey] = container;

        const offset = {
            x: 0,
            y: opener.offsetHeight,
            handler: null
        };

        // find host...
        let host = opener.parentElement as HTMLElement;
        while (host) {
            const current = host;
            host = host.parentElement as HTMLElement;
            if (host === document.body) {
                // we have reached top...
                break;
            }
            if (host.classList.contains("page-host")) {
                // we have reached popup host...
                host = current;
                break;
            }
            offset.x += host.offsetLeft;
            offset.y += host.offsetTop;
        }

        if (!host) {
            // tslint:disable-next-line: no-console
            console.warn("Aborting popup display as host no longer exists");
            return;
        }

        const style = container.element.style;
        style.position = "absolute";
        style.left = offset.x + "px";
        style.top = offset.y + "px";
        style.zIndex = "1000";

        host.appendChild(container.element);
        container.registerDisposable({
            dispose: () => host.removeEventListener("click", offset.handler)
        });

        offset.handler = (e: Event) => {
            let start = e.target as HTMLElement;
            while (start) {
                if (start === opener) {
                    return;
                }
                if (start === container.element) {
                    return;
                }
                start = start.parentElement;
            }
            container.element.remove();
            container.dispose();
        };

        host.addEventListener("click", offset.handler);
    }

    public hide(popup: AtomControl) {
        const container = popup[containerKey] as PopupContainer;
        container?.element?.remove();
        container?.dispose();
    }

}
