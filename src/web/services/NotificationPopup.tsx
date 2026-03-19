import XNode from "../../core/XNode.js";
import { PopupWindow } from "./PopupService.js";

import "./NotifcationPopup.global.css";

const css = "web-atoms-notification-popup";

export default function NotificationPopup({
    message,
    type
}): typeof PopupWindow {

    return class Notification extends PopupWindow {

        public create(): void {
            if(message instanceof XNode) {
                this.render(<div
                    styleClass={({
                        [css]: 1,
                        error: /error/i.test(type),
                        warning: /warn/i.test(type)
                    })}>
                    { message }
                </div>);
                return;
            }
            this.render(<div
                styleClass={({
                    [css]: 1,
                    error: /error/i.test(type),
                    warning: /warn/i.test(type)
                })}
                formattedText={message}
            />);
        }
    };
}
