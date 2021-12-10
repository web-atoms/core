import { AtomDisposableList } from "../../core/AtomDisposableList";
import Colors from "../../core/Colors";
import { CancelToken } from "../../core/types";
import DISingleton from "../../di/DISingleton";
import StyleRule from "../../style/StyleRule";
import { AtomControl } from "../controls/AtomControl";
import CSS from "../styles/CSS";

const popupCss = CSS(StyleRule("popup")
    .padding(5)
    .backgroundColor(Colors.white)
    .border("solid 1px lightgray")
    .borderRadius(5)
    .boxShadow("rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;")
    .display("inline-block")
);

export interface IPopupOptions {
    /**
     * Popup alignment, default is auto starting with right and below
     */
    alignment?: "left" | "right" | "auto" | "above" | "below" | "centerOfScreen";
    popupStyle?: string;
    cancelToken?: CancelToken;
}

function getParent(e: HTMLElement): AtomControl {
    let start = e;
    while (start) {
        if (start.atomControl) {
            return start.atomControl;
        }
        start = start._logicalParent ?? start.parentElement;
    }
}

export interface IPopup {
    element: HTMLElement;
    disposables: AtomDisposableList;
    dispose();
    registerDisposable(f: any);
}

@DISingleton({})
export default class PopupService {

    private id = 1001;

    /**
     * Display given popup attached to given opener and returns
     * disposable that can be used to dispose the popup
     * @param opener Element which opens this popup
     * @param popup Popup Element, it must be rendered within the opener's parent
     * @param options IPopupOptions
     * @returns IDisposable
     */
    public show(
        opener: HTMLElement,
        popup: HTMLElement,
        options?: IPopupOptions): IPopup {
        const container: IPopup = {
            element: document.createElement("div"),
            disposables: new AtomDisposableList(),
            registerDisposable: null,
            dispose: null,
        };
        container.registerDisposable = (f) => container.disposables.add(f);
        const popupStyle = options?.popupStyle ?? popupCss;
        container.element._logicalParent = opener;
        container.element.classList.add(popupStyle);
        container.element.appendChild(popup);
        const offset = {
            x: opener.offsetLeft,
            y: opener.offsetTop + opener.offsetHeight,
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

        if (options?.alignment === "centerOfScreen") {
            style.margin = "auto";
        } else {

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
        }
        style.zIndex = `${this.id++}`;

        host.appendChild(container.element);
        container.dispose = () => {
            container.disposables.dispose();
            host.removeEventListener("click", offset.handler);
            const parent = getParent(opener);
            parent.dispose(container.element);
            container.element.remove();
        };

        offset.handler = (e: Event) => {
            let start = e.target as HTMLElement;
            while (start) {
                if (start === host) {
                    break;
                }
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

        const ct = options?.cancelToken;
        if (ct) {
            ct.registerForCancel(() => container.dispose());
        }

        return container;
    }

}
