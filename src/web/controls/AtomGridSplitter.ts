import { BindableProperty } from "../../core/BindableProperty";
import { IDisposable, IRect } from "../../core/types";
import { AtomControl } from "./AtomControl";
import { AtomGridView } from "./AtomGridView";

/**
 * Grid Splitter can only be added inside a Grid
 */
export class AtomGridSplitter extends AtomControl {

    @BindableProperty
    public direction: "vertical" | "horizontal" = "vertical";

    @BindableProperty
    public dragging: boolean = false;

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

            const cell = ((this.element as any).cell as string)
                .split(",").map( (s) => s.trim().split(":").map( (st) => parseInt(st.trim(), 10) ) );

            disposables.push(this.bindEvent(document.body, "mousemove", (me: MouseEvent) => {
                // do drag....
                const { screenX, screenY } = me;

                const dx = screenX - rect.x;
                const dy = screenY - rect.y;

                if (isVertical) {
                    parent.resize("column", cell[0][0], dx);
                } else {
                    parent.resize("row", cell[1][0], dy);
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
