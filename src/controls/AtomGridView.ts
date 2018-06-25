import { bindableProperty } from "../core/bindable-properties";
import { IRect } from "../core/types";
import { AtomControl, IAtomControlElement } from "./AtomControl";

interface IOffsetSize {
    offset: number;
    size: number;
}

/**
 * GridView columns or rows can accept comma separated strings with
 * absolute pixel value, percent value and star (*).
 *
 * For example, 20% of total width for first column, 200 pixel for last column
 * and rest of the space is for middle = "20%, *, 200"
 *
 * You can have only one star specification.
 */
export class AtomGridView extends AtomControl {

    @bindableProperty
    public columns: string = "*";

    @bindableProperty
    public rows: string = "*";

    private columnSizes: IOffsetSize[];

    private rowSizes: IOffsetSize[];

    private children: HTMLElement[];

    private attempt: number = 0;

    private availableRect: IRect = null;

    constructor(e?: HTMLElement) {
        super(e || document.createElement("section"));

        window.addEventListener("resize", (evt) => {
            this.updateSize();
        });

        const style = this.element.style;
        style.position = "absolute";
        style.left = style.right = style.top = style.bottom = "0";
    }

    public append(e: HTMLElement | Text | AtomControl): AtomControl {
        const ee = e instanceof AtomControl ? (e as AtomControl).element : e as HTMLElement;
        ((ee as any) as IAtomControlElement)._logicalParent = this.element as IAtomControlElement;
        this.children = this.children || [];
        this.children.push(e instanceof AtomControl ? (e as AtomControl).element : e as HTMLElement);
        return this;
    }

    public onUpdateUI(): void {

        this.attempt ++;

        this.removeAllChildren(this.element);

        const width =  this.element.offsetWidth || this.element.clientWidth || parseFloat(this.element.style.width);
        const height = this.element.offsetHeight || this.element.clientHeight || parseFloat(this.element.style.height);

        if (!(width && height)) {
            if (this.attempt > 100) {
                // tslint:disable-next-line:no-console
                console.error(`AtomDockPanel (${width}, ${height}) must both have non zero width and height`);
                return;
            }
            // AtomDispatcher.instance.callLater(() => this.invalidate());
            setTimeout(() => {
                this.invalidate();
            }, 100);
            return;
        }

        this.attempt = 0;

        this.availableRect = { width, height, x: 0, y: 0 };

        this.columnSizes = this.columns.split(",").map( (s) => this.toSize(s.trim(), this.availableRect.width));
        this.rowSizes = this.rows.split(",").map( (s) => this.toSize(s.trim(), this.availableRect.height));

        this.assignOffsets(this.columnSizes, this.availableRect.width);
        this.assignOffsets(this.rowSizes, this.availableRect.height);

        for (const iterator of this.children) {
            const host = document.createElement("section");
            host.appendChild(iterator);
            this.element.appendChild(host);
        }
        super.onUpdateUI();
        this.updateSize();
    }

    public resize(item: "column" | "row", index: number, delta: number): void {

        const a = item === "column" ? this.columnSizes : this.rowSizes;
        const prev = a[index - 1];
        const next = a[index + 1];
        if ((!prev) || (!next)) {
            throw new Error("Grid Splitter cannot be start or end element in GridView");
        }
        const current = a[index];
        prev.size += delta;
        current.offset += delta;
        next.offset += delta;
        next.size -= delta;
        this.updateSize();
    }

    protected onUpdateSize(): void {
        for (const iterator of this.children) {
            this.updateStyle(iterator);
        }
    }

    private updateStyle(e: HTMLElement): void {

        const cell = (e as any).cell as string;
        const tokens = cell.split(",")
            .map( (s) => s.trim().split(":").map( (st) => parseInt(st.trim(), 10) ) );

        const column = tokens[0][0];
        const row = tokens[1][0];

        const colSpan = tokens[0][1] || 1;
        const rowSpan = tokens[1][1] || 1;

        const host = e.parentElement as HTMLElement;
        host.style.position = "absolute";
        host.style.overflow = "hidden";
        host.style.padding = "0";
        host.style.margin = "0";

        const rowStart = this.rowSizes[row].offset;
        let rowSize = 0;
        for (let i = row; i < row + rowSpan; i++) {
            rowSize += this.rowSizes[i].size;
        }

        host.style.top = `${rowStart}px`;
        host.style.height = `${rowSize}px`;

        const colStart = this.columnSizes[column].offset;
        let colSize = 0;
        for (let i = column; i < column + colSpan; i++) {
            colSize += this.columnSizes[i].size;
        }

        host.style.left = `${colStart}px`;
        host.style.width = `${colSize}px`;

    }

    private toSize(s: string, total: number): IOffsetSize {
        if (!s || s === "*") {
            return { offset: -1, size: NaN };
        }

        let n: number = 0;
        if (s.endsWith("%")) {
            s = s.substr(0, s.length - 1);
            n = parseFloat(s);
            return { offset: -1, size: total * n / 100 };
        }

        return { offset: -1, size: parseFloat(s) };
    }

    private assignOffsets(a: IOffsetSize[], end: number): void {
        let start = 0;
        let fill: IOffsetSize = null;
        for (const item of a) {
            item.offset = start;
            if (isNaN(item.size)) {
                fill = item;
                break;
            }
            start += item.size;
        }
        if (!fill) {
            return;
        }
        const lastStart = start;
        start = end;

        const r = a.map((x) => x).reverse();

        for (const item of r) {
            if (isNaN(item.size)) {
                if (fill !== item) {
                    throw new Error("Multiple * cannot be defined");
                }
                break;
            }
            start -= item.size;
            item.offset = start;
        }
        fill.offset = lastStart;
        fill.size = start - lastStart;
    }
}
