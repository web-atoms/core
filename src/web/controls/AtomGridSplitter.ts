import { BindableProperty } from "../../core/BindableProperty.js";
import { IDisposable, IRect } from "../../core/types.js";
import { AtomControl } from "./AtomControl.js";
import { AtomGridView } from "./AtomGridView.js";

/**
 * Grid Splitter can only be added inside a Grid
 */
export class AtomGridSplitter extends AtomControl {

    public direction: "vertical" | "horizontal";

    public dragging: boolean = false;

    protected preCreate() {
        this.direction = "vertical";
        this.dragging = false;
    }

    protected create(): void {
        this.bind(this.element, "styleCursor", [["direction"]], false,
            (v) => v === "vertical" ? "ew-resize" : "ns-resize");

        this.bind(this.element, "styleBackgroundColor", [["dragging"]], false,
            (v) => v  ? "blue" : "lightgray");
        const style = this.element.style;
        style.position = "absolute";
        style.left = style.top = style.bottom = style.right = "0";

        this.bindEvent(this.element, "mousedown", (e: MouseEvent) => {

            e.preventDefault();

            this.dragging = true;

            const parent = this.parent as AtomGridView;

            const isVertical = this.direction === "vertical";

            const disposables: IDisposable[] = [];

            const rect: IRect = { x: e.screenX, y: e.screenY };

            const {column, row} = AtomGridView.getCellInfo(this.element);

            const ss = document.createElement("style");
            ss.textContent = "iframe { pointer-events: none }";
            document.head.appendChild(ss);

            disposables.push({
                dispose: () => ss.remove()
            });

            disposables.push(this.bindEvent(document.body, "mousemove", (me: MouseEvent) => {

                // do drag....
                const { screenX, screenY } = me;

                const dx = screenX - rect.x;
                const dy = screenY - rect.y;

                if (isVertical) {
                    parent.resize("column", column, dx);
                } else {
                    parent.resize("row", row, dy);
                }

                rect.x = screenX;
                rect.y = screenY;

            }));

            disposables.push(this.bindEvent(document.body, "mouseup", (mup) => {
                // stop
                this.dragging = false;
                for (const iterator of disposables) {
                    iterator.dispose();
                }
            }));

        });
    }
}
