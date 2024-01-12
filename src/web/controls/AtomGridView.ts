import { BindableProperty } from "../../core/BindableProperty";
import { visitDescendents } from "../../core/Hacks";
import { IRect } from "../../core/types";
import { AtomControl } from "./AtomControl";

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
 * @example
 *  <AtomGridView
 *     rows="50,*"
 *     columns="20%, 5, *, 200">
 *
 *      <!-- Header spans for three columns in first row -->
 *      <header row="0" column="0:3"></header>
 *
 *      <!-- menu is on first column -->
 *      <menu row="1" column="0"></menu>
 *
 *      <!-- Grid splitter splits 1st and 3rd column and itself lies in 2nd column -->
 *      <AtomGridSplitter row="1" column="1" direction="vertical" />
 *
 *      <!-- Section fills remaining area -->
 *      <section row="1" column="2"></section>
 *
 *      <!-- Help sits on last column -->
 *      <Help row="1" column="3"></Help>
 *  </AtomGridView>
 */
export class AtomGridView extends AtomControl {

    public static getCellInfo(e: HTMLElement): { row: number, rowSpan: number,  column: number, colSpan: number } {

        let row = 0;
        let column = 0;
        let rowSpan = 1;
        let colSpan = 1;

        const cell = (e as any).cell as string;
        if (cell) {
            // tslint:disable-next-line:no-console
            console.warn("Attribute `cell` is obsolete, please use row and column attributes separately");
            const tokens = cell.split(",")
                .map( (s) => s.trim().split(":").map( (st) => parseInt(st.trim(), 10) ) );

            column = tokens[0][0];
            row = tokens[1][0];

            colSpan = tokens[0][1] || 1;
            rowSpan = tokens[1][1] || 1;
        } else {
            let c: string = (((e as any).row) || "0") as string;
            let tokens = c.split(":").map( (st) => parseInt(st.trim(), 10));
            row = tokens[0];
            rowSpan = tokens[1] || 1;
            c = (((e as any).column) || "0") as string;
            tokens = c.split(":").map( (st) => parseInt(st.trim(), 10));
            column = tokens[0];
            colSpan = tokens[1] || 1;
        }

        return {
            row,
            rowSpan,
            column,
            colSpan,
        };
    }

    public columns: string;

    public rows: string;

    private columnSizes: IOffsetSize[];

    private rowSizes: IOffsetSize[];

    private children: HTMLElement[];

    private attempt: number = 0;

    private availableRect: IRect = null;

    private childrenReady: boolean = false;

    public append(e: HTMLElement | Text | AtomControl): AtomControl {
        const ee = e instanceof AtomControl ? (e as AtomControl).element : e as HTMLElement;
        ((ee as any) as HTMLElement)._logicalParent = this.element;
        this.children = this.children || [];
        this.children.push(e instanceof AtomControl ? (e as AtomControl).element : e as HTMLElement);
        return this;
    }

    public onUpdateUI(): void {

        this.attempt ++;

        // this.removeAllChildren(this.element);

        const c1 = this.children ??= [];
        c1.length = 0;

        let child = this.element.firstElementChild;
        while (child) {
            const c = child;
            c1.push(c as any);
            child = child.nextElementSibling;
            c.remove();
        }

        const width =  this.element.offsetWidth ||
            this.element.clientWidth ||
            parseFloat(this.element.style.width) ||
            0;
        const height = this.element.offsetHeight ||
            this.element.clientHeight ||
            parseFloat(this.element.style.height) ||
            0;

        if (!(width && height)) {

            if (this.childrenReady) {

                // this is the time parent is hidden

                setTimeout(() => {
                    this.invalidate();
                }, 5000);
                return;
            }

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

        if (!this.children) {
            return;
        }

        this.attempt = 0;

        this.availableRect = { width, height, x: 0, y: 0 };

        this.columnSizes = (this.columns || "*").split(",")
            .map( (s) => this.toSize(s.trim(), this.availableRect.width));
        this.rowSizes = (this.rows || "*").split(",")
            .map( (s) => this.toSize(s.trim(), this.availableRect.height));

        this.assignOffsets(this.columnSizes, this.availableRect.width);
        this.assignOffsets(this.rowSizes, this.availableRect.height);

        for (const iterator of this.children) {
            const host = document.createElement("section");
            host.appendChild(iterator);
            this.element.appendChild(host);
        }
        super.onUpdateUI();
        this.updateSize();
        this.childrenReady = true;
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

    public onPropertyChanged(name: string): void {
        switch (name) {
            case "rows":
            case "columns":
                if (this.childrenReady) {
                    this.invalidate();
                }
                break;
        }
    }

    protected onUpdateSize(): void {
        if (!this.children) {
            return;
        }
        for (const iterator of this.children) {
            this.updateStyle(iterator);
        }
    }

    protected preCreate(): void {
        this.columns = null;
        this.rows = null;
        const style = this.element.style;
        style.position = "absolute";
        style.left = style.right = style.top = style.bottom = "0";
        style.overflow = "hidden";

        this.bindEvent(window as any, "resize", () => {
            this.updateSize();
        });
        this.bindEvent(document.body, "resize", () => {
            this.updateSize();
        });
    }

    private updateStyle(e: HTMLElement): void {

        const { colSpan, column, row, rowSpan } = AtomGridView.getCellInfo(e);
        const host = e.parentElement as HTMLElement;
        if (!host) {
            return;
        }
        host.style.position = "absolute";
        host.style.overflow = "hidden";
        host.style.padding = "0";
        host.style.margin = "0";

        if (this.rowSizes.length <= row || this.columnSizes.length <= column) {
            return;
        }

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

        visitDescendents(host, (el, ac) => {
            if (ac) {
                ac.invalidate();
                return false;
            }
            return true;
        });

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
