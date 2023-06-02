import XNode from "../../core/XNode";
import styled from "../../style/styled";
import { PopupWindow } from "./PopupService";

const css = styled.css `
    padding: 5px;
    font-size: larger;
    & .error {
        color: red;
        border-color: red;
    }
    & .warning {
        background-color: lightyellow;
    }
`.installLocal();

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
