import Bind from "../../core/Bind";
import Colors from "../../core/Colors";
import XNode from "../../core/XNode";
import StyleRule from "../../style/StyleRule";
import CSS from "../styles/CSS";
import { PopupWindow } from "./PopupService";

const css = CSS(StyleRule("notification-popup")
    .padding(5)
    .fontSize("larger")
    .nested(StyleRule(".error")
        .color(Colors.red)
        .borderColor(Colors.red)
    )
    .nested(StyleRule(".warning")
        .backgroundColor(Colors.lightYellow)
    )
);

export default function NotificationPopup({
    message,
    type
}): typeof PopupWindow {

    return class Notification extends PopupWindow {

        public create(): void {
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
