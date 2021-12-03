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

export interface IPopupOptions {
    /**
     * Popup alignment, default is auto starting with right and below
     */
    alignment?: "left" | "right" | "auto" | "above" | "below";
    popupStyle?: PopupStyle;
}

@DISingleton({})
export default class PopupService {

    private id = 1001;

    /**
     * Display given popup attached to given opener and returns
     * disposable that can be used to dispose the popup
     * @param opener Element which opens this popup
     * @param popup Popup Control
     * @param options IPopupOptions
     * @returns IDisposable
     */
    public show(
        opener: HTMLElement,
        popup: AtomControl,
        options?: IPopupOptions) {
        const container = new PopupContainer(popup.app);
        const popupStyle = options?.popupStyle;
        if (popupStyle) {
            container.controlStyle = popupStyle;
        }
        container.element.appendChild(popup.element);
        popup[containerKey] = container;

        const offset = {
            x: opener.offsetLeft,
            y: opener.offsetHeight,
            handler: null
        };

        // find host...
        let host = opener.offsetParent as HTMLElement;
        while (host) {
            const current = host;
            if (host === document.body) {
                // we have reached top...
                break;
            }
            host = host.offsetParent as HTMLElement;
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

        const hostHeight = host.offsetHeight
        || host.clientHeight
        || (host.firstElementChild as HTMLElement).offsetHeight;

        const style = container.element.style;
        style.position = "absolute";
        if (!options || options?.alignment === "auto") {

            // check where is more space??
            if (offset.x < (host.offsetWidth / 2)) {
                style.left = offset.x + "px";
            } else {
                style.right = `${(host.offsetWidth - (offset.x + opener.offsetWidth))}px`;
            }

            if (offset.y < (hostHeight / 2)) {
                style.top = offset.y + "px";
            } else {
                style.bottom = `${hostHeight - (offset.y + opener.offsetHeight)}px`;
            }

        } else {
            if (options?.alignment === "right") {
                style.right = `${(host.offsetWidth - (opener.offsetLeft + opener.offsetWidth))}px`;
            } else {
                style.left = offset.x + "px";
            }
        }
        style.zIndex = `${this.id++}`;

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

        return {
            dispose: () => {
                this.hide(popup);
            }
        };
    }

    public hide(popup: AtomControl) {
        const container = popup[containerKey] as PopupContainer;
        container?.element?.remove();
        container?.dispose();
    }

}
