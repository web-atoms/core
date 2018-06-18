import { Category, Test, TestItem } from "../unit/base-test";
import { AtomGridView } from "./AtomGridView";

@Category("Grid view")
export class TestCase extends TestItem {

    @Test()
    public async test(): Promise<any> {
        const gv = new AtomGridView(document.createElement("section"));
        gv.columns = "20,*,50";
        gv.rows = "10,*,30%";
        gv.element.style.width = "1000px";
        gv.element.style.height = "1000px";

        const header = document.createElement("header");
        const headerAny = header as any;
        headerAny.row = 0;
        headerAny.column = 0;
        headerAny.colSpan = 3;

        gv.append(header);

        const footer = document.createElement("footer");
        const footerAny = footer as any;
        footerAny.row = 2;
        footerAny.column = 0;
        footerAny.colSpan = 3;

        gv.append(footer);

        const left = document.createElement("div");
        const leftAny = left as any;
        leftAny.row = 1;
        leftAny.column = 0;

        gv.append(left);

        const right = document.createElement("div");
        const rightAny = right as any;
        rightAny.row = 1;
        rightAny.column = 2;

        gv.append(right);

        const fill = document.createElement("div");
        const fillAny = fill as any;
        fillAny.row = 1;
        fillAny.column = 1;

        gv.append(fill);

        gv.invalidate();

        await this.delay(100);

        // tslint:disable-next-line:no-debugger
        debugger;
    }

}
